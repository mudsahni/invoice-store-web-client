import React from "react";
import {FolderSelection} from "@/components/collections/FolderSelection";
import {SelectedFolder} from "@/components/collections/SelectedFolder";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";
import {useAuth} from "@/contexts/AuthContext";
import {InputWithButton} from "@/components/collections/InputWithButton";
import {XCircleIcon} from "lucide-react";
import {collectionsService} from "@/services/collectionService";
import {CollectionStatusEvent, CollectionType, CreateCollectionResponse} from "@/types/collections";
import {useRouter} from 'next/navigation';
import {Steps, StepStatus} from "@/components/Steps";

const defaultSteps = [
    {id: '01', name: 'Select Folder', status: StepStatus.NOT_STARTED},
    {id: '02', name: 'Select Files', status: StepStatus.NOT_STARTED},
    {id: '03', name: 'Add Collection Name', status: StepStatus.NOT_STARTED},
    {id: '04', name: 'Create Collection', status: StepStatus.NOT_STARTED},
]

let fileCounter = 0;
const generateId = () => `pdf-${fileCounter++}`;

export const NewCollectionTool = () => {
    // const [steps, setSteps] = React.useState<Step[]>(defaultSteps)
    const router = useRouter();
    const [collectionCreationLoading, setCollectionCreationLoading] = React.useState<boolean>(false)
    const [steps, setSteps] = React.useState(defaultSteps);
    // Example state that changes based on user input or other logic
    const [collectionId, setCollectionId] = React.useState<string | null>(null);

    // Once `shouldNavigate` is true, navigate to the dynamic page
    React.useEffect(() => {
        if (collectionId) {
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
        setIsProcessing,
        setSelectedResult,
        showError,
        setShowError
    } = useNewCollectionContext();

    const savedTenant = localStorage.getItem('tenant')
    let savedTenantJson = null
    if (savedTenant) {
        savedTenantJson = JSON.parse(savedTenant)
    }
    const fileInputRef = React.createRef<HTMLInputElement>();
    const [isCollectionNameValid, setIsCollectionNameValid] = React.useState(false);
    const [, setCollectionStatus] = React.useState<CollectionStatusEvent | null>(null);

    const {authUser, loading} = useAuth();

    React.useEffect(() => {
        // Create new array to avoid mutating state directly
        const updatedSteps = [...steps];

        // Helper function to update step status
        const updateStep = (index: number, status: StepStatus) => {
            updatedSteps[index] = {...updatedSteps[index], status};
        };

        // Step 1: Folder Selection
        const folderSelected = pdfFiles.length > 0;
        updateStep(0, folderSelected ? StepStatus.COMPLETED : StepStatus.NOT_STARTED);

        // Step 2: File Selection
        const filesSelected = pdfFiles.filter(file => file.selected).length > 0;
        updateStep(1,
            !folderSelected ? StepStatus.NOT_STARTED :
                filesSelected ? StepStatus.COMPLETED :
                    StepStatus.IN_PROGRESS
        );

        // Step 3: Collection Name - Now completed when valid
        const collectionNameValid = collectionName.length > 0 && validateInput(collectionName).isValid;
        updateStep(2,
            !folderSelected || !filesSelected ? StepStatus.NOT_STARTED :
                collectionNameValid ? StepStatus.COMPLETED :
                    StepStatus.IN_PROGRESS
        );

        // Step 4: Create Collection
        updateStep(3,
            !folderSelected || !filesSelected || !collectionNameValid
                ? StepStatus.NOT_STARTED
                : StepStatus.IN_PROGRESS
        );

        // Only update state if steps have changed
        if (JSON.stringify(steps) !== JSON.stringify(updatedSteps)) {
            setSteps(updatedSteps);
        }

    }, [pdfFiles, collectionName, isCollectionNameValid, steps]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {isValid, errorMessage} = validateInput(collectionName);

        if (!isValid) {
            setShowError(true);
            // Optionally update the error state here.
            setError(errorMessage);
            return;
        }
        // set up create collection response
        let collectionCreationResponse: CreateCollectionResponse | undefined = undefined

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
                filesMap,
                new Map<string, string>([
                    ['tenantId', savedTenantJson.id],
                    ['email', authUser.email]
                ])
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
        // check if folder is selected
        if (pdfFiles.length === 0) {
            return {
                isValid: false,
                errorMessage: 'No folder selected.'
            };
        }

        // check for selected files
        const selectedFiles = pdfFiles.filter(file => file.selected);
        if (selectedFiles.length === 0) {
            return {
                isValid: false,
                errorMessage: 'Please select at least one PDF file to process.'
            };
        }
        if (value.length < 4) {
            setIsCollectionNameValid(false)
            return {
                isValid: false,
                errorMessage: 'Input must be at least 4 characters.'
            }
        }
        // Check for length between 0 and 100
        if (value.length > 100) {
            setIsCollectionNameValid(false)
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
        setPdfFiles(pdfFiles);
        setError('');
        setSuccess('');
        setProcessedData({});
        setSelectedResult(null);

        if (files.length === 0) {
            setError('No folder selected.');
            setShowError(true)
        } else if (pdfFiles.length === 0) {
            setError('No PDF files found in the selected folder.');
            setShowError(true)
        }
    };


    return (
        <div className={"rounded-xl pt-8"}>
            <Steps steps={steps}/>
            {showError && error.length > 0 && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
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

            <div className="space-y-4">

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
                    loading={collectionCreationLoading}
                    handleSubmit={handleSubmit}
                />


            </div>
        </div>
    )
}