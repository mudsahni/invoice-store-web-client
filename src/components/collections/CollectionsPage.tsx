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

const CollectionsPageHeader: React.FC = () => {
    return (
        <div className="bg-transparent rounded-xl my-8">
            <div className="flex px-0 align-middle items-center">
                <FolderOpenIcon className="h-6 mr-4 dark:text-gray-200 text-gray-800"/>
                <span className="text-2xl/7 dark:text-gray-200 text-gray-800 font-medium">Document Collections</span>
            </div>
            <p className="py-4 dark:text-gray-400 text-gray-600 text-base text-justify font-medium">
                A collection is a set of documents grouped together because of the being uploaded together and/or
                sharing a common trait between them. This page will allow you to create a new collection, view existing
                collections which you previously created
                or are shared with you, and manage the documents within each collection.
            </p>
        </div>
    )
}

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
    const [browseCollections, setBrowseCollections] = React.useState<boolean>(false)
    const [createNewCollection, setCreateNewCollection] = React.useState<boolean>(true)
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([])
    const [loadCollections, setLoadCollections] = React.useState<boolean>(false)
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
            setBrowseCollections(true)
            setLoadCollections(true)
            const cachedData = collectionsCache.get('user_collections'); // or any appropriate ID
            if (cachedData) {
                setCollections(cachedData.data);
                setLoadCollections(false);
                return;
            }
            // Fetch collections from the server
            // If no cache or expired, fetch from server
            const fetchedCollections = await collectionsService.getCollections();
            const sortedCollections = fetchedCollections.collections.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
            // Cache the new data
            collectionsCache.set('user_collections', sortedCollections);
            setCollections(sortedCollections)
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoadCollections(false);
        }
    }

    const routeToCollection = (collectionId: string) => {
        router.push(`/collections/${collectionId}`)
    }

    return (
        <Content className="dark:bg-gray-800 rounded-xl">

            <Breadcrumbs pages={[
                {name: 'Collections', href: '/collections', current: true},
            ]}/>
            <CollectionsPageHeader/>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                    title="Click to create a new collection."
                    type="button"
                    onClick={() => setCreateNewCollection(true)}
                    className={`group w-full sm:flex-1 ${createNewCollection ? 'dark:bg-gray-900 bg-gray-100 dark:text-gray-500 text-gray-600 dark:border-gray-500 border-gray-500 pointer-events-none' : 'bg-blue-600 text-blue-50 border-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'} inline-flex gap-x-1.5 rounded-lg border-2 px-4 py-3 text-lg shadow-sm`}
                >

                    <div className="w-full text-left">
                        <div className="flex align-middle items-center pb-8">
                            <FolderPlusIcon aria-hidden="true" className="mr-2 size-5"/>
                            <span className="text-base font-semibold">Create New Collection</span>
                        </div>
                        <div>
                            <p className={`text-base ${createNewCollection ? 'text-gray-500' : 'text-blue-100'} font-medium`}>Click
                                here to create
                                a new
                                collection of your
                                choice by
                                selecting
                                documents which you want to
                                upload and structure into parsable data.</p>
                        </div>
                    </div>
                    <div>
                        <PlusIcon aria-hidden="true"
                                  className="size-5 group-hover:scale-[1.5] transition-transform duration-500"/>
                    </div>
                </button>

                <button
                    title="Click to view your collections."
                    type="button"
                    onClick={() => getCollections()}
                    className={`group w-full sm:flex-1 ${browseCollections ? 'dark:bg-gray-900 bg-gray-100 dark:text-gray-500 text-gray-600 dark:border-gray-500 border-neutral-500 pointer-events-none' : 'bg-blue-600 text-blue-50 border-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'} inline-flex gap-x-1.5 rounded-lg border-2 px-4 py-3 text-lg shadow-sm`}
                >

                    <div className="w-full text-left">
                        <div className="flex align-middle items-center pb-8">
                            <FolderOpenIcon aria-hidden="true" className="mr-2 size-5"/>
                            <span className="text-base font-semibold">Browse Your Collections</span>
                        </div>
                        <div>
                            <p className={`text-base ${browseCollections ? 'text-gray-500' : 'text-blue-100'} font-medium`}>Click
                                Click here to view all the collections you have created previously. You can also drill
                                down and see collection details.</p>
                        </div>
                    </div>
                    <div className="relative">
                        <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="size-5 relative z-10 group-hover:scale-[1.5] transition-transform duration-500"
                        />

                    </div>
                </button>
            </div>
            {
                createNewCollection && <CreateNewCollection setCreateNewCollection={setCreateNewCollection}/>
            }
            {
                browseCollections && <YourCollectionsTable
                    setBrowseCollections={setBrowseCollections}
                    routeToCollection={routeToCollection}
                    collections={collections}
                    loadCollections={loadCollections}
                    handleRefresh={handleRefresh}
                />
            }
        </Content>
    )
}