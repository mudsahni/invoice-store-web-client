import React from "react";
import {FolderSelection} from "@/components/parser/FolderSelection";
import {SelectedFolder} from "@/components/parser/SelectedFolder";
import {useNewCollectionContext} from "@/components/parser/context/NewCollectionContext";
import {useAuth} from "@/contexts/AuthContext";
import {InputWithButton} from "@/components/ui/InputWithButton";
import {XCircleIcon} from "lucide-react";
import {collectionsService} from "@/services/collectionService";
import {CollectionStatusEvent, CollectionType} from "@/types/collections";

let fileCounter = 0;
const generateId = () => `pdf-${fileCounter++}`;

export const NewCollectionTool = () => {

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
        setSelectedResult
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

    const listenToCollectionStatusEvents = async (collectionId: string) => {
        // Start listening to events
        const unsubscribe = collectionsService.subscribeToCollectionEvents(
            collectionId,
            (event) => {
                console.log('Received event:', event);
                setCollectionStatus(event);

                // Optionally unsubscribe when processing is complete
                if (event.status === 'COMPLETED' || event.status === 'FAILED') {
                    unsubscribe();
                }
            }
        );

        // Clean up subscription when component unmounts
        return () => {
            unsubscribe();
        };

    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedFiles = pdfFiles.filter(file => file.selected);

        if (selectedFiles.length === 0) {
            setError('Please select at least one PDF file to process');
            return;
        }

        setIsProcessing(true);
        setError('');
        setSuccess('');

        try {
            // Log the files we're about to send
            console.log('Selected files:', selectedFiles);

            if (!authUser || !authUser.email) {
                console.log('Auth user:', authUser)
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

            const collectionCreationResponse = await collectionsService.createCollection(
                collectionName,
                CollectionType.INVOICE,
                filesMap
            );

            listenToCollectionStatusEvents(collectionCreationResponse.id);

            // create map of pdf files with name and file value from selected file
            const selectedFileMap: {[key:string]: File} = {}
            selectedFiles.map(file => {
                selectedFileMap[file.file.name] = file.file
            })

            console.log("Here is the response from the collection creation", collectionCreationResponse)
            await Promise.all(
                Object.keys(collectionCreationResponse.documents).map(async (key) => {
                    const signedUrlData = collectionCreationResponse.documents[key].uploadUrl;
                    const fileName = collectionCreationResponse.documents[key].fileName;
                    const documentId = collectionCreationResponse.documents[key].documentId;
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
            setError('No folder selected');
        } else if (pdfFiles.length === 0) {
            setError('No PDF files found in the selected folder');
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {pdfFiles.length === 0 ?
                    (
                        <>
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
                    loading={loading}
                    handleSubmit={handleSubmit}
                />
            </form>
        </div>
    )
}