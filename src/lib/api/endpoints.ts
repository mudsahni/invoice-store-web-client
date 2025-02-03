export const API_ENDPOINTS = {
    COLLECTIONS: {
        CREATE: '/collections',
        GET: (id: string) => `/collections/${id}`,
        GET_WITH_DOCUMENTS: (id: string) => `/collections/${id}/documents`,
        LIST: '/collections',
        DELETE: (id: string) => `/collections/${id}`,
        STREAM: (id: string) => `/collections/${id}/sse`,
    },
    USERS: {
        GET: (id: string) => `/users/${id}`,
    }
} as const;
