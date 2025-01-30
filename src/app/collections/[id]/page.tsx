import { notFound } from 'next/navigation';

interface Props {
    params: {
        id: string;
    }
}

export default async function CollectionPage({ params }: Props) {
    // You can access the id from params
    const { id } = params;

    // Example of fetching collection data
    try {
        // const collection = await fetchCollection(id);

        return (
            <div>
                <h1>Collection {id}</h1>
                {/* Your collection details here */}
            </div>
        );
    } catch (error) {
        // Handle 404s
        notFound();
    }
}

