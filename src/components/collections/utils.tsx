// Add this function at the top of your component
import {CollectionStatus, DocumentStatus} from "@/types/collections";

export const getStatusStyles = (status: string) => {

    switch (status) {
        case CollectionStatus.COMPLETED:
        case DocumentStatus.VALIDATED:
            return {
                badge: 'bg-green-100 border-green-800 text-green-800',
                border: 'border-green-700'
            };
        case CollectionStatus.IN_PROGRESS:
        case DocumentStatus.IN_PROGRESS:
        case CollectionStatus.DOCUMENT_UPLOADING_TASKS_CREATED:
        case CollectionStatus.DOCUMENTS_UPLOAD_COMPLETE:
            return {
                badge: 'bg-sky-100 border-sky-800 text-sky-800',
                border: 'border-sky-700'
            };
        case CollectionStatus.FAILED:
        case DocumentStatus.ERROR:
            return {
                badge: 'bg-red-100 border-red-800 text-red-800',
                border: 'border-red-700'
            };
        default:
            return {
                badge: 'bg-gray-100 border-gray-800 text-gray-800',
                border: 'border-gray-700'
            };
    }
};

