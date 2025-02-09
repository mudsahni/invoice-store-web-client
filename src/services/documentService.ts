import {CollectionDocument, DownloadDocumentResponse} from "@/types/collections";
import {apiClient} from "@/lib/api";
import {API_ENDPOINTS} from "@/lib/api/endpoints";

export class DocumentsService {

    async getDocument(
        id: string
    ): Promise<CollectionDocument> {

        return await apiClient.get<CollectionDocument>(
            API_ENDPOINTS.DOCUMENTS.GET(id)
        );

    }

    async getDocumentDownloadLink(
        id: string
    ): Promise<DownloadDocumentResponse> {

        return await apiClient.get<DownloadDocumentResponse>(
            API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id)
        );
    }

    async validateDocument(
        id: string
    ): Promise<{ [key: string]: { field: string, message: string } }> {

        return await apiClient.get<{ [key: string]: { field: string, message: string } }>(
            API_ENDPOINTS.DOCUMENTS.VALIDATE(id)
        );

    }
}

export const documentService = new DocumentsService();
