// src/app/collections/[id]/page.tsx
import React from "react";
import CollectionPage from "@/components/collection/CollectionPage";
import ProtectedRoute from "@/contexts/ProtectedRoute";

export default async function Collection(
    props: {
        params: Promise<{ collectionId: string }>;
    }
) {

    const params = await props.params;

    return (
        <ProtectedRoute>
            <CollectionPage id={params.collectionId}/>
        </ProtectedRoute>
    );
}