import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
    NewCollectionRequest,
    CreateCollectionResponse,
    CollectionType,
    SignedUrlResponse, CollectionStatusEvent
} from '@/types/collections';

export class CollectionsService {
    /**
     * Create a new collection with the given files and metadata
     */
    async createCollection(
        name: string,
        type: CollectionType,
        files: Record<string, string>
    ): Promise<CreateCollectionResponse> {
        const request: NewCollectionRequest = {
            name,
            type,
            files,
        };

        const response = await apiClient.post<CreateCollectionResponse>(
            API_ENDPOINTS.COLLECTIONS.CREATE,
            request
        );

        return response
    }

    /**
     * Upload a file to a signed URL
     */
    async uploadFile(signedUrl: string, file: File): Promise<void> {
        const response = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }
    }

    subscribeToCollectionEvents(collectionId: string, onEvent: (event: CollectionStatusEvent) => void): () => void {
        return apiClient.stream(API_ENDPOINTS.COLLECTIONS.STREAM(collectionId), onEvent);
    }

}

export const collectionsService = new CollectionsService();
