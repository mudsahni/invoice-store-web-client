import React from "react";
import {useRouter} from 'next/navigation';
import {AlertCircle} from "lucide-react";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";
import {useAuth} from "@/contexts/AuthContext";
import {FolderSelection} from "@/components/collections/FolderSelection";
import {SelectedFolder} from "@/components/collections/SelectedFolder";
import {InputWithButton} from "@/components/collections/InputWithButton";
import {collectionsService} from "@/services/collectionService";
import {CollectionStatusEvent, CollectionType, CreateCollectionResponse} from "@/types/collections";

// Step interface and default steps
interface Step {
    id: string;
    name: string;
    status: StepStatus;
}

enum StepStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed'
}

const defaultSteps: Step[] = [
    {id: '01', name: 'Select Folder', status: StepStatus.NOT_STARTED},
    {id: '02', name: 'Select Files', status: StepStatus.NOT_STARTED},
    {id: '03', name: 'Add Details', status: StepStatus.NOT_STARTED},
    {id: '04', name: 'Create Collection', status: StepStatus.NOT_STARTED},
];

// Helper function for generating unique IDs
let fileCounter = 0;
const generateId = () => `pdf-${fileCounter++}`;

export const NewCollectionTool = () => {
    const router = useRouter();
    const [collectionCreationLoading, setCollectionCreationLoading] = React.useState<boolean>(false);
    const [steps, setSteps] = React.useState<Step[]>(defaultSteps);
    const [collectionId, setCollectionId] = React.useState<string | null>(null);

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

    const {authUser, loading} = useAuth();
    const fileInputRef = React.createRef<HTMLInputElement>();
    const [isCollectionNameValid, setIsCollectionNameValid] = React.useState(false);
    const [, setCollectionStatus] = React.useState<CollectionStatusEvent | null>(null);

    // Function to upload files in batches
    const uploadFilesBatched = async (documents: any, selectedFileMap: { [key: string]: File }, batchSize = 5) => {
        const fileNames = Object.keys(documents);
        const totalFiles = fileNames.length;
        let uploadedCount = 0;

        // Process files in batches
        for (let i = 0; i < totalFiles; i += batchSize) {
            const batch = fileNames.slice(i, i + batchSize);

            // Upload current batch in parallel
            await Promise.all(
                batch.map(async (key) => {
                    const signedUrlData = documents[key].uploadUrl;
                    const fileName = documents[key].fileName;

                    if (signedUrlData && selectedFileMap[fileName]) {
                        try {
                            await collectionsService.uploadFile(signedUrlData, selectedFileMap[fileName]);
                            uploadedCount++;

                            // Optional: Update UI to show progress
                            setSuccess(`Uploading files: ${uploadedCount}/${totalFiles}`);
                        } catch (error) {
                            console.error(`Failed to upload ${fileName}:`, error);
                            // Continue with other files even if one fails
                        }
                    }
                })
            );

            // Small delay between batches to prevent overwhelming the network
            if (i + batchSize < totalFiles) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return uploadedCount;
    };
    // Navigate to collection page after creation
    React.useEffect(() => {
        if (collectionId) {
            router.push(`/collections/${collectionId}`);
        }
    }, [collectionId, router]);

    // Update steps based on user progress
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

    // Form validation
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
                errorMessage: 'Please select at least one file to process.'
            };
        }

        if (value.length < 4) {
            setIsCollectionNameValid(false);
            return {
                isValid: false,
                errorMessage: 'Collection name must be at least 4 characters.'
            };
        }

        // Check for length between 0 and 100
        if (value.length > 100) {
            setIsCollectionNameValid(false);
            return {
                isValid: false,
                errorMessage: 'Collection name must be less than 100 characters.'
            };
        }

        // Check for allowed characters only (letters, numbers, underscore, dash, and period)
        const validCharacterRegex = /^[a-zA-Z0-9._-]*$/;
        if (!validCharacterRegex.test(value)) {
            setIsCollectionNameValid(false);
            return {
                isValid: false,
                errorMessage: 'Only letters, numbers, underscores (_), dashes (-), and periods (.) are allowed.'
            };
        }

        setIsCollectionNameValid(true);
        return {
            isValid: true,
            errorMessage: ''
        };
    };

    // Define supported file types
    const SUPPORTED_FILE_TYPES: { [key: string]: string[] } = {
        'application/pdf': ['pdf'],
        'image/jpeg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/tiff': ['tif', 'tiff']
    };

    // Helper function to check if file is supported
    const isFileSupported = (file: File): boolean => {
        // Check MIME type first
        if (SUPPORTED_FILE_TYPES[file.type]) {
            return true;
        }

        // Fallback to extension check
        const extension = file.name.split('.').pop()?.toLowerCase();
        return Object.values(SUPPORTED_FILE_TYPES).flat().includes(extension || '');
    };

    const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        const filteredFiles = files
            .filter(isFileSupported)
            .map(file => {
                return {
                    id: generateId(),
                    selected: true, // Pre-select files for better UX
                    name: file.name,
                    webkitRelativePath: file.webkitRelativePath,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    file: file,
                    fileType: file.type.includes('pdf') ? 'pdf' : 'image'
                };
            });

        setPdfFiles(filteredFiles);
        setError('');
        setSuccess('');
        setProcessedData({});
        setSelectedResult(null);

        if (files.length === 0) {
            setError('No folder selected.');
            setShowError(true);
        } else if (filteredFiles.length === 0) {
            setError('No supported files found in the selected folder. Please upload PDFs or images (JPEG, PNG, TIFF).');
            setShowError(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {isValid, errorMessage} = validateInput(collectionName);

        if (!isValid) {
            setShowError(true);
            setError(errorMessage);
            return;
        }

        // Prepare for collection creation
        let collectionCreationResponse: CreateCollectionResponse | undefined = undefined;
        const selectedFiles = pdfFiles.filter(file => file.selected);

        // Final validation checks
        if (pdfFiles.length === 0) {
            setError('No folder selected.');
            setShowError(true);
            return;
        }

        if (selectedFiles.length === 0) {
            setError('Please select at least one file to process.');
            setShowError(true);
            return;
        }

        if (collectionName.length === 0) {
            setError('Please enter a collection name.');
            setShowError(true);
            return;
        }

        // Begin collection creation process
        setCollectionCreationLoading(true);
        setIsProcessing(true);
        setError('');
        setSuccess('');

        try {
            const savedTenant = localStorage.getItem('tenant');
            let savedTenantJson = null;
            if (savedTenant) {
                savedTenantJson = JSON.parse(savedTenant);
            }

            if (!authUser || !authUser.email) {
                throw new Error('User information not available');
            }

            if (!savedTenantJson) {
                throw new Error('Tenant information not available');
            }

            // Create files map for backend
            const filesMap: Record<string, string> = {};
            for (const pdfFile of selectedFiles) {
                filesMap[pdfFile.file.name] = pdfFile.file.type;
            }

            // Create collection
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
                setCollectionId(collectionCreationResponse.id);
            }

            // Create map of selected files
            const selectedFileMap: { [key: string]: File } = {};
            selectedFiles.forEach(file => {
                selectedFileMap[file.file.name] = file.file;
            });

            // Upload files in batches
            const uploadedCount = await uploadFilesBatched(
                collectionCreationResponse.documents,
                selectedFileMap,
                5  // Process 5 files at a time
            );
            
            // Update UI with success
            setSuccess(`Successfully processed ${selectedFiles.length} files!`);
            setProcessedData(collectionCreationResponse.documents);

            // Select the first result by default
            const firstFileName = Object.keys(collectionCreationResponse.documents)[0];
            if (firstFileName) {
                setSelectedResult(firstFileName);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process files');
            setShowError(true);
        } finally {
            setIsProcessing(false);
            setCollectionCreationLoading(false);
        }
    };

    // Render the component
    return (
        <div className="w-full max-w-8xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                                        step.status === StepStatus.COMPLETED
                                            ? 'bg-sky-600 text-white'
                                            : step.status === StepStatus.IN_PROGRESS
                                                ? 'bg-sky-100 text-sky-800 border-2 border-sky-600'
                                                : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="mt-2 text-xs font-medium text-gray-700">{step.name}</div>
                            </div>

                            {/* Connector line between steps */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-2">
                                    <div
                                        className={`h-0.5 ${
                                            step.status === StepStatus.COMPLETED
                                                ? 'bg-sky-600'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Error Alert */}
            {showError && error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0"/>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Folder Selection or Selected Files */}
            <div className="space-y-6">
                {pdfFiles.length === 0 ? (
                    <FolderSelection
                        fileInputRef={fileInputRef}
                        handleFolderSelect={handleFolderSelect}
                    />
                ) : (
                    <SelectedFolder
                        fileInputRef={fileInputRef}
                        handleFolderSelect={handleFolderSelect}
                    />
                )}

                {/* Collection Details */}
                <InputWithButton
                    loading={collectionCreationLoading}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};