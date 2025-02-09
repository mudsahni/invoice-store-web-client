import React from 'react';
import {InvoicePage} from "@/components/invoices/InvoicePage";
import ProtectedRoute from "@/contexts/ProtectedRoute";

export default async function Page(
    props: {
        params: Promise<{ collectionId: string, documentId: string }>;
    }
) {
    const params = await props.params;

    return (
        <ProtectedRoute>
            <InvoicePage invoiceId={params.documentId}/>
        </ProtectedRoute>
    )
}