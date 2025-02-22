import React from 'react';
import ProtectedRoute from "@/contexts/ProtectedRoute";
import {DocumentPage} from "@/components/document/DocumentPage";

export default async function Page(
    props: {
        params: Promise<{ collectionId: string, documentId: string }>;
    }
) {
    const params = await props.params;

    return (
        <ProtectedRoute>
            <DocumentPage documentId={params.documentId}/>
        </ProtectedRoute>
    )
}