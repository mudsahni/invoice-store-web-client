import {ApiClient} from "@/lib/api/client";

export const apiClient = new ApiClient({
    baseUrlPrefix: process.env.NEXT_PUBLIC_DOCUMENT_STORE_API || 'https://documentstore-741672280176.asia-south2.run.app/api/v1',
    timeout: 15000,
});

