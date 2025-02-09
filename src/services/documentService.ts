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

    async downloadDocument(
        id: string
    ): Promise<DownloadDocumentResponse> {

        return await apiClient.get<DownloadDocumentResponse>(
            API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id)
        );

    }
}

export const documentService = new DocumentsService();
