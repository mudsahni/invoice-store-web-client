import React from 'react'
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {
    FolderOpenIcon,
    BookOpenIcon,
    FolderPlusIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import {CollectionStatus, CollectionType, GetCollectionResponse} from "@/types/collections";
import {collectionsService} from "@/services/collectionService";
import {useRouter} from "next/navigation";
import {PlusIcon} from "lucide-react";
import {YourCollectionsTable} from "@/components/collections/YourCollectionsTable";
import {CreateNewCollection} from "@/components/collections/CreateNewCollection";
import {CacheManager} from "@/services/cacheManager";
import Content from "@/components/ui/Content";
import PageHeader from "@/components/ui/PageHeader";


export interface CollectionsPageProps {

}

const projects = [
    {
        id: "2f16d972-d818-4040-a85a-880efd39f1db",
        name: 'Logo redesign',
        type: <div
            className="bg-sky-100 border-2 border-sky-800 text-xs text-sky-800 inline-flex justify-center p-1 rounded-md font-semibold">{CollectionType.INVOICE}</div>,
        createdAt: '2024-01-01',
        updatedAt: 'Collection has not been updated.',
        status: <div
            className="bg-green-100 border-2 border-green-800 text-xs text-green-800 inline-flex justify-center p-1 rounded-md font-semibold">{CollectionStatus.COMPLETED}</div>,
        blank: <ChevronRightIcon className="h-6 mx-4 text-sky-800"/>
    },
    // More projects...
]

// Create a cache instance (put this outside your component)
const collectionsCache = new CacheManager<GetCollectionResponse[]>({
    prefix: '',
    ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
});


export const CollectionsPage: React.FC<CollectionsPageProps> = () => {
    const [createNewCollection, setCreateNewCollection] = React.useState<boolean>(true)
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([])
    const [loadCollections, setLoadCollections] = React.useState<boolean>(true)
    const router = useRouter();

    const handleRefresh = async () => {
        try {
            // Clear the cache before fetching new data
            collectionsCache.clear('user_collections');
            // Call the original getCollections function
            await getCollections();
        } catch (error) {
            console.error('Error refreshing collections:', error);
        }
    };

    const getCollections = async () => {
        try {
            setLoadCollections(true)
            const cachedData = collectionsCache.get('user_collections'); // or any appropriate ID
            if (cachedData) {
                // Apply sorting to cached data
                const sortedCachedData = [...cachedData.data].sort((a, b) => {
                    // Compare seconds first
                    if (a.createdAt.seconds !== b.createdAt.seconds) {
                        return b.createdAt.seconds - a.createdAt.seconds; // Newest first
                    }
                    // If seconds are equal, compare nanoseconds
                    return b.createdAt.nanos - a.createdAt.nanos;
                });

                setCollections(sortedCachedData);
                setLoadCollections(false);
                return;
            }
            // Fetch collections from the server
            // If no cache or expired, fetch from server
            const fetchedCollections = await collectionsService.getCollections();
            // Sort Firestore timestamp objects
            const sortedCollections = [...fetchedCollections.collections].sort((a, b) => {
                // Compare seconds first
                if (a.createdAt.seconds !== b.createdAt.seconds) {
                    return b.createdAt.seconds - a.createdAt.seconds; // Newest first
                }
                // If seconds are equal, compare nanoseconds
                return b.createdAt.nanos - a.createdAt.nanos;
            });
            // Cache the new data
            collectionsCache.set('user_collections', sortedCollections);
            setCollections(sortedCollections)
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoadCollections(false);
        }
    }

    React.useEffect(() => {
        getCollections()

    }, [])

    const routeToCollection = (collectionId: string) => {
        router.push(`/collections/${collectionId}`)
    }

    const CollectionsPageHeader: React.FC = () => {
        return (
            <div className="bg-transparent rounded-xl my-8">
                <div className="flex align-middle items-center justify-between">
                    <PageHeader title="Collections"/>
                    <button
                        title="Create Collection"
                        onClick={() => setCreateNewCollection(true)}
                        className={`${createNewCollection ? 'bg-gray-200 pointer-events-none border-2 border-gray-400 text-gray-400' : 'bg-sky-100 border-2 border-sky-800 hover:bg-sky-200 cursor-pointer text-sky-800'} sm:p-4 p-3 rounded-lg group`}>
                        <div className="flex items-center font-semibold">
                            <FolderPlusIcon className="sm:h-6 h-6"/>
                            <span
                                className="lg:block hidden ml-4">
                            Create Collection
                        </span>
                        </div>
                    </button>

                </div>
                <p className="py-4 dark:text-gray-400 text-gray-600 text-base text-justify font-medium">
                    A collection is a set of documents grouped together because of the being uploaded together and/or
                    sharing a common trait between them. This page will allow you to create a new collection, view
                    existing
                    collections which you previously created
                    or are shared with you, and manage the documents within each collection.
                </p>
            </div>
        )
    }

    return (
        <Content className="dark:bg-gray-800 rounded-xl">

            <Breadcrumbs/>
            <CollectionsPageHeader/>
            {
                createNewCollection && <CreateNewCollection setCreateNewCollection={setCreateNewCollection}/>
            }

            <YourCollectionsTable
                routeToCollection={routeToCollection}
                collections={collections}
                loadCollections={loadCollections}
                handleRefresh={handleRefresh}
            />

        </Content>
    )
}