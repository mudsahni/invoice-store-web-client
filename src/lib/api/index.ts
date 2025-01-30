import {ApiClient} from "@/lib/api/client";

export const apiClient = new ApiClient({
    baseUrlPrefix: process.env.NEXT_PUBLIC_DOCUMENT_STORE_API || 'http://localhost:8080/api/v1',
    timeout: 15000,
});

