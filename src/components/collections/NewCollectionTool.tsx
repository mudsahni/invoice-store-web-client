import React from "react";
import {FolderSelection} from "@/components/collections/FolderSelection";
import {SelectedFolder} from "@/components/collections/SelectedFolder";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";
import {useAuth} from "@/contexts/AuthContext";
import {InputWithButton} from "@/components/ui/InputWithButton";
import {XCircleIcon} from "lucide-react";
import {collectionsService} from "@/services/collectionService";
import {CollectionStatusEvent, CollectionType, CreateCollectionResponse} from "@/types/collections";
import {useRouter} from 'next/navigation';

// const defaultSteps: Step[] = [
//     {
//         name: 'Select Folder',
//         description: 'Select the folder with the files you want to store and parse.',
//         href: '#',
//         status: 'current'
//     },
//     {
//         name: 'Select files for collection',
//         description: 'Select the files which you want to store and parse.',
//         href: '#',
//         status: 'upcoming',
//     },
//     {name: 'Enter collection name', description: 'Enter the name of the collection.', href: '#', status: 'upcoming'},
//     {name: 'Create Collection', description: 'Click on the create collection button!', href: '#', status: 'upcoming'},
// ]
//
let fileCounter = 0;
const generateId = () => `pdf-${fileCounter++}`;

export const NewCollectionTool = () => {
    // const [steps, setSteps] = React.useState<Step[]>(defaultSteps)
    const router = useRouter();
    const [collectionCreationLoading, setCollectionCreationLoading] = React.useState<boolean>(false)

    // Example state that changes based on user input or other logic
    const [collectionId, setCollectionId] = React.useState<string | null>(null);

    // Once `shouldNavigate` is true, navigate to the dynamic page
    React.useEffect(() => {
        if (collectionId) {
            // Replace 'abc' with the actual ID you want to navigate to
            router.push(`/collections/${collectionId}`);
        }
    }, [collectionId, router]);


    const {
        pdfFiles,
        setPdfFiles,
        error,
        setError,
        setSuccess,
        setProcessedData,
        collectionName,
        setCollectionName,
        setIsProcessing,
        setSelectedResult,
    } = useNewCollectionContext();

    const savedTenant = localStorage.getItem('tenant')
    let savedTenantJson = null
    if (savedTenant) {
        savedTenantJson = JSON.parse(savedTenant)
    }
    const fileInputRef = React.createRef<HTMLInputElement>();
    const [, setIsCollectionNameValid] = React.useState(false);
    const [, setCollectionStatus] = React.useState<CollectionStatusEvent | null>(null);

    const {authUser, loading} = useAuth();


    // React.useEffect(() => {
    //     if (pdfFiles.length === 0) {
    //         setSteps(defaultSteps)
    //     } else {
    //         setSteps((prevState) => {
    //             const updatedSteps = prevState
    //             if (pdfFiles.length > 0) {
    //                 updatedSteps[0].status = 'complete'
    //                 updatedSteps[1].status = 'current'
    //                 const anySelectedFiles = pdfFiles.filter(file => file.selected).length > 0
    //                 console.log("Any selected files", anySelectedFiles)
    //                 if (anySelectedFiles) {
    //                     updatedSteps[1].status = 'complete'
    //                     updatedSteps[2].status = 'current'
    //                 }
    //             }
    //
    //             if (collectionName.length > 0) {
    //                 updatedSteps[2].status = 'complete'
    //                 updatedSteps[3].status = 'current'
    //             }
    //             return updatedSteps
    //         })
    //     }
    // }, [pdfFiles, collectionName])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // set up create collection response
        let collectionCreationResponse: CreateCollectionResponse | undefined = undefined

        // set steps
        // setSteps((prevState) => {
        //     const updatedSteps = prevState
        //     updatedSteps[3].status = 'complete'
        //     return updatedSteps
        // })

        if (pdfFiles.length === 0) {
            setError('No folder selected.');
            return;
        }
        // alert for not having selected any files
        const selectedFiles = pdfFiles.filter(file => file.selected);
        if (selectedFiles.length === 0) {
            setError('Please select at least one PDF file to process.');
            return;
        }

        if (collectionName.length === 0) {
            setError('Please enter a collection name.');
            return;
        }

        // set vars
        setCollectionCreationLoading(true)
        setIsProcessing(true);
        setError('');
        setSuccess('');

        try {
            if (!authUser || !authUser.email) {
                throw new Error('User information not available');
            }

            if (!savedTenantJson) {
                console.log("Tenant not found in local storage")
                throw new Error('Tenant information not available');
            }

            const filesMap: Record<string, string> = {};
            for (const pdfFile of selectedFiles) {
                filesMap[pdfFile.file.name] = "application/pdf"
            }

            collectionCreationResponse = await collectionsService.createCollection(
                collectionName,
                CollectionType.INVOICE,
                filesMap
            );

            if (collectionCreationResponse === undefined) {
                throw new Error('Failed to create collection');
            } else {
                setCollectionId(collectionCreationResponse.id)
            }

            // create map of pdf files with name and file value from selected file
            const selectedFileMap: { [key: string]: File } = {}
            selectedFiles.map(file => {
                selectedFileMap[file.file.name] = file.file
            })

            console.log("Here is the response from the collection creation", collectionCreationResponse)
            await Promise.all(
                Object.keys(collectionCreationResponse.documents).map(async (key) => {
                    const signedUrlData = collectionCreationResponse!!.documents[key].uploadUrl;
                    const fileName = collectionCreationResponse!!.documents[key].fileName;
                    const documentId = collectionCreationResponse!!.documents[key].documentId;
                    console.log('Signed URL data:', signedUrlData)
                    if (signedUrlData) {
                        console.log('Uploading file:', fileName, documentId, signedUrlData);
                        await collectionsService.uploadFile(signedUrlData, selectedFileMap[fileName]);
                        console.log('File uploaded:', fileName, documentId, signedUrlData);
                    }
                })
            );


            setSuccess(`Successfully uploaded ${selectedFiles.length} PDF files!`);
            setProcessedData(collectionCreationResponse.documents);
            setSuccess(`Successfully processed ${selectedFiles.length} PDF files!`);

            // Select the first result by default
            const firstFileName = Object.keys(collectionCreationResponse.documents)[0];
            if (firstFileName) {
                setSelectedResult(firstFileName);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process PDFs');
        } finally {
            setIsProcessing(false);
        }

    };

    const validateInput = (value: string) => {
        if (value.length < 4) {
            setIsCollectionNameValid(false)
            setError('Input must be at least 4 characters.')
            return {
                isValid: false,
                errorMessage: 'Input must be at least 4 characters.'
            }
        }
        // Check for length between 0 and 100
        if (value.length > 100) {
            setIsCollectionNameValid(false)
            setError('Input must be less than 100 characters')
            return {
                isValid: false,
                errorMessage: 'Input must be less than 100 characters'
            };
        }

        // Check for allowed characters only (letters, numbers, underscore, dash, and period)
        const validCharacterRegex = /^[a-zA-Z0-9._-]*$/;
        if (!validCharacterRegex.test(value)) {
            setIsCollectionNameValid(false)
            setError('Only letters, numbers, underscores (_), dashes (-), and periods (.) are allowed')
            return {
                isValid: false,
                errorMessage: 'Only letters, numbers, underscores (_), dashes (-), and periods (.) are allowed'
            };
        }

        setIsCollectionNameValid(true)
        return {
            isValid: true,
            errorMessage: ''
        };
    };

    const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        console.log('Raw files from input:', files);

        const pdfFiles = files
            .filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
            .map(file => {
                // Keep the original File object in a property
                return {
                    id: generateId(),
                    selected: false,
                    name: file.name,
                    webkitRelativePath: file.webkitRelativePath,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    // Store the actual File object
                    file: file
                };
            });

        console.log('Processed PDF files:', pdfFiles);
        // setSteps((prevState) => {
        //     const updatedSteps = prevState
        //     if (pdfFiles.length > 0) {
        //         updatedSteps[0].status = 'complete'
        //         updatedSteps[1].status = 'current'
        //         const anySelectedFiles = pdfFiles.filter(file => file.selected).length > 0
        //         console.log("Any selected files", anySelectedFiles)
        //         if (anySelectedFiles) {
        //             updatedSteps[1].status = 'complete'
        //             updatedSteps[2].status = 'current'
        //         }
        //     }
        //     return updatedSteps
        // })
        setPdfFiles(pdfFiles);
        setError('');
        setSuccess('');
        setProcessedData({});
        setSelectedResult(null);

        if (files.length === 0) {
            setError('No folder selected');
        } else if (pdfFiles.length === 0) {
            setError('No PDF files found in the selected folder');
        }
    };


    return (
        <div className={"rounded-xl pt-8"}>
            {/*<Steps steps={steps} />*/}

            <form onSubmit={handleSubmit} className="space-y-4">

                {pdfFiles.length === 0 ?
                    (
                        <>
                            <FolderSelection fileInputRef={fileInputRef} handleFolderSelect={handleFolderSelect}/>
                        </>

                    ) : (
                        <SelectedFolder fileInputRef={fileInputRef} handleFolderSelect={handleFolderSelect}/>
                    )
                }
                <InputWithButton
                    value={collectionName}
                    setValue={setCollectionName}
                    buttonLabel={'Create Collection'}
                    placeholder={'Enter a collection name'}
                    validate={validateInput}
                    loading={collectionCreationLoading}
                    handleSubmit={handleSubmit}
                />

                {error.length > 0 && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <XCircleIcon aria-hidden="true" className="size-5 text-red-400"/>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>

                )}

            </form>
        </div>
    )
}