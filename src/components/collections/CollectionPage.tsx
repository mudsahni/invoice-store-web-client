'use client'
import {collectionsService} from "@/services/collectionService";
import {CollectionStatus, CollectionStatusEvent, DocumentStatus} from "@/types/collections";
import React from "react";


interface CollectionPageProps {
    id: string
}
const CollectionPage: React.FC<CollectionPageProps> = ({id}) => {

    const listenToCollectionStatusEvents = async (collectionId: string) => {
        // Start listening to events
        const unsubscribe = await collectionsService.subscribeToCollectionEvents(
            collectionId,
            (event) => {
                console.log('Adding event to stream:', event);
                setCreateCollectionEvents((prevState) => [...prevState, event]);
                // Optionally unsubscribe when processing is complete
                if (event.status === CollectionStatus.COMPLETED || event.status === CollectionStatus.FAILED) {
                    console.log(`${new Date().toISOString()} Processing complete, unsubscribing`);
                    unsubscribe();
                }
            }
        );

        // Clean up subscription when component unmounts
        return unsubscribe;
    }

    const [createCollectionEvents, setCreateCollectionEvents] =
        React.useState<CollectionStatusEvent[]>([])

    React.useEffect(() => {

        async function fetchCollectionEvents() {
            await listenToCollectionStatusEvents(id);
        }
        // Store the unsubscribe function

        fetchCollectionEvents()

        return () => {
            setCreateCollectionEvents([])
        }
    }, [id])

    return <div>
        <h1>Collection: {id}</h1>
        <div>

            {createCollectionEvents.map((event, index) =>
                <div key={index}>
                    <span>{event.id}</span>
                    <span>{event.status}</span>
                    <span>{event.type}</span>
                    <div>
                        {Object.entries(event.documents).map(([key, value]) =>
                            <div key={index}>
                                <span>{key}</span>
                                <span>{value}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
}

export default CollectionPage