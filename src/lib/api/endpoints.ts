export const API_ENDPOINTS = {
    COLLECTIONS: {
        CREATE: '/collections',
        GET: (id: string) => `/collections/${id}`,
        GET_WITH_DOCUMENTS: (id: string) => `/collections/${id}/documents`,
        LIST: '/collections',
        DELETE: (id: string) => `/collections/${id}`,
        STREAM: (id: string) => `/collections/${id}/sse`,
        EXPORT: (id: string) => `/collections/${id}/export`,
    },
    USERS: {
        GET: (id: string) => `/users/${id}`,
    },
    DOCUMENTS: {
        CREATE: '/documents',
        GET: (id: string) => `/documents/${id}`,
        LIST: '/documents',
        DELETE: (id: string) => `/documents/${id}`,
        DOWNLOAD: (id: string) => `/documents/${id}/download`,
        VALIDATE: (id: string) => `/documents/${id}/validate`,
        UPDATE: (id: string) => `/documents/${id}/update`,
    }
} as const;
