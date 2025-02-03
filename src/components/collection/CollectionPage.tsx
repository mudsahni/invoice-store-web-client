'use client'
import {collectionsService} from "@/services/collectionService";
import {
    CollectionStatus,
    CollectionStatusEvent,
    CollectionWithDocuments,
} from "@/types/collections";
import React, {useState} from "react";
import {UserData} from "@/types/auth";
import {userService} from "@/services/userService";
import {getCollectionCachedData, isCollectionCacheValid, setCollectionCachedData} from "@/components/collection/utils";
import {DocumentTable} from "@/components/collection/DocumentTable";
import {CollectionMetadata} from "@/components/collection/CollectionMetadata";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";


interface CollectionPageProps {
    id: string
}

const DOCUMENT_COLS = ["Name", "Type", "Status", ""]

const CollectionPage: React.FC<CollectionPageProps> = ({id}) => {
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [collection, setCollection] = useState<CollectionWithDocuments | undefined>();
    const [createCollectionEvents, setCreateCollectionEvents] =
        useState<CollectionStatusEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [collectionUserDetails, setCollectionUserDetails] = useState<UserData>();

    const listenToCollectionStatusEvents = async (collectionId: string) => {
        // Start listening to events
        const unsubscribe = await collectionsService.subscribeToCollectionEvents(
            collectionId,
            async (event) => {
                console.log('Adding event to stream:', event);
                setCreateCollectionEvents((prevState) => [...prevState, event]);
                const fetchedCollection = await collectionsService.getCollection(id);
                setCollection(fetchedCollection);
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


    React.useEffect(() => {
        let eventUnsubscribe: (() => void) | undefined;

        const initialize = async () => {
            try {
                setIsLoading(true);
                const cachedData = getCollectionCachedData(id);
                if (cachedData && isCollectionCacheValid(cachedData)) {
                    setCollection(cachedData.collectionWithDocuments);
                    setLastUpdated(new Date(cachedData.timestamp));
                } else {
                    const fetchedCollection = await collectionsService.getCollection(id);
                    setCollection(fetchedCollection);
                    setCollectionCachedData(id, fetchedCollection)
                    if (!fetchedCollection || fetchedCollection.status !== CollectionStatus.COMPLETED) {
                        console.log("Collection doesn't exist, starting event listening");
                        eventUnsubscribe = await listenToCollectionStatusEvents(id);
                    } else {
                        // get user info
                        setCollectionUserDetails(await userService.getUser(fetchedCollection.createdBy))
                    }
                }
            } catch (error) {
                console.error("Error initializing collection:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();

        return () => {
            if (eventUnsubscribe) {
                eventUnsubscribe();
            }
            setCreateCollectionEvents([]);
        };

    }, [id])


    if (isLoading) {
        return <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <LoadingSpinner size={13}/>
        </div>;
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto px-8">
                <Breadcrumbs pages={[
                    {name: 'Collections', href: '/collections', current: false},
                    {name: collection?.name || 'Loading...', href: `#`, current: true}
                ]}/>
            </div>
            {!collection ? (
                createCollectionEvents.map((event, index) => (
                    <div key={index}>
                        <span>{event.id}</span>
                        <span>{event.status}</span>
                        <span>{event.type}</span>
                        <div>
                            {Object.entries(event.documents).map(([key, value], docIndex) => (
                                <div key={`${index}-${docIndex}`}>
                                    <span>{key}</span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <CollectionMetadata collection={collection}/>

                    <DocumentTable documents={collection.documents}/>
                </div>
            )}
        </div>
    )
}

export default CollectionPage