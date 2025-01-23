export type Tenant = {
    id: string;
    name: string;
    domain: string;
    settings: {
        allowedEmailDomains: string[]
    }
    createdAt: Date
    updatedAt: Date | null
};

export type UserData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
    createdAt: Date
    updatedAt: Date | null
};
