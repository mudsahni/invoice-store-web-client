// src/app/collections/[id]/page.tsx
export default async function CollectionPage(
    props: {
        params: Promise<{ id: string }>;
    }
) {
    const params = await props.params;
    return (
        <div>
            <h1>Collection: {params.id}</h1>
        </div>
    );
}