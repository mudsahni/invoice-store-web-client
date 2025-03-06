import {apiClient} from '@/lib/api';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {
    NewCollectionRequest,
    CreateCollectionResponse,
    CollectionType,
    SignedUrlResponse, CollectionStatusEvent, GetCollectionsResponse, Collection, CollectionWithDocuments
} from '@/types/collections';

export class CollectionsService {

    async getCollections(): Promise<GetCollectionsResponse> {
        const response = await apiClient.get<GetCollectionsResponse>(
            API_ENDPOINTS.COLLECTIONS.LIST
        );

        return response
    }

    /**
     * Create a new collection with the given files and metadata
     */
    async createCollection(
        name: string,
        type: CollectionType,
        files: Record<string, string>,
        tags: Map<string, string>
    ): Promise<CreateCollectionResponse> {
        const request: NewCollectionRequest = {
            name,
            type,
            files,
            tags
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
    async uploadFile(signedUrl: string, file: File, maxRetries = 3): Promise<void> {
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt < maxRetries) {
            try {
                const response = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
                }

                // Success! Exit the retry loop
                return;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                attempt++;

                // If we haven't reached max retries yet, wait before trying again
                // Use exponential backoff to increase wait time for each retry
                if (attempt < maxRetries) {
                    const backoffTime = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s, etc.
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                }
            }
        }

        // If we've exhausted all retries, throw the last error
        throw new Error(`Failed to upload file after ${maxRetries} attempts: ${lastError?.message}`);
    }

    async subscribeToCollectionEvents(
        collectionId: string,
        onEvent: (event: CollectionStatusEvent) => void
    ): Promise<() => void> {
        const unsubscribe = await apiClient.stream(
            API_ENDPOINTS.COLLECTIONS.STREAM(collectionId),
            onEvent
        );
        return unsubscribe;
    }

    async getCollection(
        id: string
    ): Promise<CollectionWithDocuments> {

        const collection: CollectionWithDocuments = await apiClient.get<CollectionWithDocuments>(
            API_ENDPOINTS.COLLECTIONS.GET_WITH_DOCUMENTS(id)
        );

        return collection

    }

    async exportCollection(
        id: string
    ): Promise<Blob> {
        return await apiClient.getBlob(
            API_ENDPOINTS.COLLECTIONS.EXPORT(id)
        );
    }
}

export const collectionsService = new CollectionsService();
