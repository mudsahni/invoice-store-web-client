export const API_ENDPOINTS = {
    COLLECTIONS: {
        CREATE: '/collections',
        GET: (id: string) => `/collections/${id}`,
        LIST: '/collections',
        DELETE: (id: string) => `/collections/${id}`,
        STREAM: (id: string) => `/collections/${id}/sse`,
    },
} as const;
