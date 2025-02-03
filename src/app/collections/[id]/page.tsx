// src/app/collections/[id]/page.tsx
import React from "react";
import CollectionPage from "@/components/collection/CollectionPage";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";

export default async function Page(
    props: {
        params: Promise<{ id: string }>;
    }
) {

    const params = await props.params;

    return (
        <ProtectedRoute>
            <div className="py-8">
                {/*<div className="px-8 mx-auto max-w-7xl">*/}
                {/*<Breadcrumbs/>*/}
                {/*</div>*/}

                <CollectionPage id={params.id} />
            </div>
        </ProtectedRoute>
    );
}