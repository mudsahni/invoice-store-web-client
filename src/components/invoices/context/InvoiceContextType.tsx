import {Invoice} from "@/types/invoice";
import React from "react";
import {ErrorSeverity} from "@/types/collections";


export interface InvoiceContextType {
    edit: boolean;
    setEdit: (value: React.SetStateAction<boolean>) => void
    invoice: Invoice;
    setInvoice: (value: React.SetStateAction<Invoice>) => void;
    editableInvoice: Invoice;
    setEditableInvoice: (value: React.SetStateAction<Invoice>) => void;
    validationErrors?: { [key: string]: { field: string, message: string, severity: ErrorSeverity } };
    setValidationErrors: (value: React.SetStateAction<{
        [key: string]: { field: string, message: string, severity: ErrorSeverity }
    }>) => void;
    handleInvoiceChange: (path: string, value: string) => void;
}