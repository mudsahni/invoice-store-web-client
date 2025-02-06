import {InvoiceWrapper} from "@/types/invoice";

export enum CollectionType {
    'INVOICE' = 'INVOICE'
}

export enum CollectionStatus {
    RECEIVED = 'RECEIVED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DOCUMENT_UPLOADING_TASKS_CREATED = 'DOCUMENT_UPLOADING_TASKS_CREATED',
    DOCUMENTS_UPLOAD_COMPLETE = 'DOCUMENTS_UPLOAD_COMPLETE',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    DELETED = 'DELETED'

}

export enum CollectionErrorType {
    COLLECTION_CREATION_ERROR = 'COLLECTION_CREATION_ERROR',
    DOCUMENT_UPLOAD_TASK_CREATION_ERROR = 'DOCUMENT_UPLOAD_TASK_CREATION_ERROR',
    DOCUMENT_UPLOAD_ERROR = 'DOCUMENT_UPLOAD_ERROR',
    EVENT_STREAM_ERROR = 'EVENT_STREAM_ERROR',
}

export enum DocumentStatus {
    UPLOADED = "UPLOADED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING = "PENDING",
    PARSED = "PARSED",
    VALIDATED = "VALIDATED",
    ERROR = "ERROR",
    APPROVED = "APPROVED",

}

export enum DocumentType {
    INVOICE = "INVOICE",
    RECEIPT = "RECEIPT",
    OTHER = "OTHER",
    INVALID = "INVALID"
}

export interface CollectionError {
    message: string;
    code: CollectionErrorType;
}

export interface SignedUrlResponse {
    uploadUrl: string;
    fileName: string;
    documentId: string;
}

export interface CreateCollectionResponse {
    id: string;
    name: string;
    status: CollectionStatus;
    type: CollectionType;
    documents: Record<string, SignedUrlResponse>;
    error?: CollectionError;
}

export interface NewCollectionRequest {
    files: Record<string, string>;
    name: string;
    type: CollectionType;
}

export interface CollectionStatusEvent {
    id: string;
    name: String;
    status: CollectionStatus;
    type: CollectionType;
    documents: Record<string, DocumentStatus>;
    error: CollectionError | null;
    timestamp: string;
}

export interface GetCollectionResponse {
    id: string;
    name: string;
    type: CollectionType;
    documents?: Record<string, DocumentStatus>;
    status: CollectionStatus;
    tags: Map<string, string>;
    createdAt: { seconds: number; nanos: number };
    updatedAt?: { seconds: number; nanos: number };
    updatedBy?: string;
}

export interface GetCollectionsResponse {
    collections: GetCollectionResponse[];
}

export interface Collection {
    id: string;
    name: string;
    type: CollectionType;
    documents: Record<string, DocumentStatus>;
    tags: Map<string, string>;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
}

export interface StructuredData {
    raw?: string;
    structured?: InvoiceWrapper
}

export interface DocumentError {
    message: string;
    code: string;
}

export enum PermissionType {
    OWNER = 'OWNER',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER'
}

export interface CollectionDocument {
    id: string;
    name: string;
    path: string;
    type: DocumentType;
    collectionId: string;
    status: DocumentStatus;
    data: StructuredData;
    private: boolean;
    error: DocumentError;
    permissions: Map<string, PermissionType>;
    createdAt: { seconds: number; nanos: number };
    createdBy: string;
    updatedAt?: { seconds: number; nanos: number };
    updatedBy?: string;
    tags: Map<string, string>;

}

export interface CollectionWithDocuments {
    id: string;
    name: string;
    type: CollectionType;
    status: CollectionStatus;
    documents: Record<string, CollectionDocument>;
    tags: Map<string, string>;
    createdAt: { seconds: number; nanos: number };
    createdBy: string;
    updatedAt?: { seconds: number; nanos: number };
    updatedBy?: string;
}