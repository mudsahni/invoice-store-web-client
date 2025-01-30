// src/app/collections/[id]/page.tsx
export default function CollectionPage({
                                           params,
                                       }: {
    params: { id: string };
}) {
    return (
        <div>
            <h1>Collection: {params.id}</h1>
        </div>
    );
}