'use client';
import React from 'react'
import {InvoiceContextProvider} from "@/components/invoices/context/InvoiceContextProvider";
import {InvoicePage} from "@/components/invoices/InvoicePage";

interface DocumentPageProps {
    documentId: string;
}

export const DocumentPage: React.FC<DocumentPageProps> = ({documentId}) => {

    return (
        <InvoiceContextProvider>
            <InvoicePage invoiceId={documentId}/>
        </InvoiceContextProvider>
    )
}