// src/app/collections/[id]/page.tsx
import React from "react";
import CollectionPage from "@/components/collections/CollectionPage";

export default async function Page(
    props: {
        params: Promise<{ id: string }>;
    }
) {

    const params = await props.params;

    return (
        <div>
            <h1>Collection: {params.id}</h1>
            <div>
                <CollectionPage id={params.id} />
            </div>
        </div>
    );
}