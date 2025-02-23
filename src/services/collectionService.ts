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
