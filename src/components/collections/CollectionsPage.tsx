import React from 'react'
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {FolderOpenIcon, BookOpenIcon, FolderPlusIcon, ChevronRightIcon} from "@heroicons/react/20/solid";
import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";
import {CollectionStatus, CollectionType, GetCollectionResponse} from "@/types/collections";
import {Collection} from "@/types/collections";
import {collectionsService} from "@/services/collectionService";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {useRouter} from "next/navigation";

const CollectionsPageHeader: React.FC = () => {
    return (
        <div className="bg-sky-50 rounded-xl my-8">
            <div className="flex p-8 align-middle items-center">
                <FolderOpenIcon className="h-6 mr-4 text-sky-800"/>
                <span className="text-2xl/7 text-sky-800 font-medium">Document Collections</span>
            </div>
            <p className="px-8 pb-8 text-sky-700 text-base text-justify font-medium">
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

export const CollectionsPage: React.FC<CollectionsPageProps> = () => {
    const [browseCollections, setBrowseCollections] = React.useState<boolean>(false)
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([])
    const [loadCollections, setLoadCollections] = React.useState<boolean>(false)
    const router = useRouter();

    const getCollections = async () => {
        setLoadCollections(true)
        // Fetch collections from the server
        const collections = await collectionsService.getCollections()
        setCollections(collections.collections)
        setBrowseCollections(true)
    }

    const routeToCollection = (collectionId: string) => {
        router.push(`/collections/${collectionId}`)
    }
    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <Breadcrumbs pages={[
                {name: 'Collections', href: '/collections', current: true},
            ]}/>
            <CollectionsPageHeader/>
            <div className="bg-sky-950 p-8 rounded-xl">
                <div className="flex items-center align-middle">
                    <FolderPlusIcon className="h-6 mr-4 text-pink-500"/>
                    <span className="text-2xl/7 text-pink-500 font-medium">New Collection</span>
                </div>
                <p className="text-sky-200 justify-text py-8 text-base font-medium">
                    Easily upload and store multiple documents in a collection for streamlined processing. Once
                    uploaded, your documents will be automatically parsed into structured data, enabling advanced
                    functionalities such as searching, filtering, and exporting. Additionally, the processed data will
                    be available for seamless integration into the GST pipeline.
                    <br/><br/>
                    Ensure your documents are in one of the supported formats for optimal processing. Supported File
                    Formats—PDFs, JPEGs, PNGs, and TIFFs.

                </p>

                <NewCollectionContextProvider>
                    <NewCollectionTool/>
                </NewCollectionContextProvider>

            </div>
            <div className="bg-neutral-50 p-8 rounded-xl">
                <span className="text-2xl/7 text-sky-800 font-medium">Your Collections</span>
                <p className="text-base font-medium text-sky-700 py-8">All your collections in one place.</p>
                {
                    browseCollections && (
                        collections.length > 0 ?
                            <div className="flow-root">
                                <table className="min-w-full">
                                    <colgroup>
                                        <col className="w-full sm:w-1/3"/>
                                        <col className="sm:w-1/5"/>
                                        <col className="sm:w-1/5"/>
                                        <col className="sm:w-1/5"/>
                                        <col className="sm:w-1/5"/>
                                    </colgroup>
                                    <thead className="border-b border-neutral-300 text-sky-900">
                                    <tr>
                                        <th scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden px-3 py-3.5 text-right text-sm font-semibold sm:table-cell"
                                        >
                                            Last Updated
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden px-3 py-3.5 text-right text-sm font-semibold sm:table-cell"
                                        >
                                            Type
                                        </th>
                                        <th scope="col"
                                            className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-0">
                                            Status
                                        </th>
                                        <th scope="col"
                                            className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-0">
                                            <span className="sr-only">Go to collection</span>
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {collections.map((collection) => (
                                        <tr
                                            key={collection.id}
                                            onClick={() => routeToCollection(collection.id)}
                                            className="border-b hover:bg-neutral-100 border-neutral-200 cursor-pointer"
                                        >
                                            <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                <div className="font-semibold text-sky-800">{collection.name}</div>
                                                <div
                                                    className="mt-1 truncate text-sky-800 text-opacity-80">Id: {collection.id}
                                                </div>
                                                <em className="text-sky-900 text-opacity-60">Created
                                                    on: {new Date(collection.createdAt.seconds * 1000).toDateString()}</em>
                                            </td>
                                            <td className="hidden px-3 py-5 text-right text-sm text-sky-800 sm:table-cell">
                                                <em>{collection.updatedAt ? new Date(collection.updatedAt.seconds * 1000).toDateString() :
                                                    'Collection has not been updated.'}</em></td>
                                            <td className="hidden px-3 py-5 text-right text-sm text-sky-800 sm:table-cell">
                                                <div
                                                    className="bg-sky-100 border-2 border-sky-800 text-xs text-sky-800 inline-flex justify-center p-1 rounded-md font-semibold">
                                                    {collection.type}
                                                </div>
                                            </td>
                                            <td className="py-5 pl-3 pr-4 text-right text-sm text-sky-800 sm:pr-0">
                                                <div
                                                    className="bg-green-100 border-2 border-green-800 text-xs text-green-800 inline-flex justify-center p-1 rounded-md font-semibold">
                                                    {collection.status}
                                                </div>
                                            </td>
                                            <td className="py-5 pl-3 pr-4 text-right text-sm text-sky-800 sm:pr-0">
                                                <ChevronRightIcon className="h-6 mx-4 text-sky-800"/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div> : <em className="text-sky-800 text-base font-medium">No collections found.</em>

                    )
                }
                {
                    !browseCollections &&
                    <div className="flex justify-center align-middle items-center sm:space-x-4 flex-wrap">

                        <button
                            type="button"
                            onClick={getCollections}
                            className="sm:mt-0 mt-4 inline-flex items-center gap-x-1.5 rounded-md border-2 border-sky-800 px-[48px] py-3 text-lg font-medium text-sky-800 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                            {loadCollections ? (<LoadingSpinner size={6}/>) : (
                                <BookOpenIcon aria-hidden="true" className="mr-2 size-5 text-sky-800"/>)}
                            {loadCollections ? 'Loading Collections' : 'Browse Collections'}
                        </button>
                    </div>

                }
            </div>
        </div>
    )
}