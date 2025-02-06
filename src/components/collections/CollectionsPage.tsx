import React from 'react'
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {
    FolderOpenIcon,
    BookOpenIcon,
    FolderPlusIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon, ArrowPathIcon
} from "@heroicons/react/20/solid";
import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";
import {CollectionStatus, CollectionType, GetCollectionResponse} from "@/types/collections";
import {collectionsService} from "@/services/collectionService";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {useRouter} from "next/navigation";
import {CrossIcon, PlusIcon, XCircleIcon} from "lucide-react";
import {create} from "node:domain";

const CollectionsPageHeader: React.FC = () => {
    return (
        <div className="bg-sky-50 rounded-xl my-8">
            <div className="flex p-8 align-middle items-center">
                <FolderOpenIcon className="h-6 mr-4 text-sky-900"/>
                <span className="text-2xl/7 text-sky-900 font-medium">Document Collections</span>
            </div>
            <p className="px-8 pb-8 text-sky-800 text-base text-justify font-medium">
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
    const [createNewCollection, setCreateNewCollection] = React.useState<boolean>(false)
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([])
    const [loadCollections, setLoadCollections] = React.useState<boolean>(false)
    const router = useRouter();

    const getCollections = async () => {
        setBrowseCollections(true)
        setLoadCollections(true)
        // Fetch collections from the server
        const collections = await collectionsService.getCollections()
        setCollections(collections.collections)
        setLoadCollections(false)
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
            <div className="flex flex-col sm:flex-row justify-between gap-4 px-1">
                <button
                    title="Click to create a new collection."
                    type="button"
                    onClick={() => setCreateNewCollection(true)}
                    className={`group w-full sm:flex-1 ${createNewCollection ? 'bg-neutral-100 text-neutral-600 border-neutral-500 pointer-events-none' : 'bg-green-50 text-green-800 border-green-800 hover:bg-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800'} inline-flex gap-x-1.5 rounded-lg border-2 px-4 py-3 text-lg shadow-sm`}
                >

                    <div className="w-full text-left">
                        <div className="flex align-middle items-center pb-8">
                            <FolderPlusIcon aria-hidden="true" className="mr-2 size-5"/>
                            <span className="text-base font-semibold">Create New Collection</span>
                        </div>
                        <div>
                            <p className={`text-base ${createNewCollection ? 'text-neutral-500' : 'text-green-700'} font-medium`}>Click
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
                    className={`group w-full sm:flex-1 ${browseCollections ? 'bg-neutral-100 text-neutral-600 border-neutral-500 pointer-events-none' : 'bg-indigo-50 text-indigo-800 border-indigo-800 hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800'} inline-flex gap-x-1.5 rounded-lg border-2 px-4 py-3 text-lg shadow-sm`}
                >

                    <div className="w-full text-left">
                        <div className="flex align-middle items-center pb-8">
                            <FolderOpenIcon aria-hidden="true" className="mr-2 size-5"/>
                            <span className="text-base font-semibold">Browse Your Collections</span>
                        </div>
                        <div>
                            <p className={`text-base ${browseCollections ? 'text-neutral-500' : 'text-indigo-700'} font-medium`}>
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
                createNewCollection && <div className="bg-gray-800 border-2 border-gray-700 p-8 rounded-xl">
                    <div className="flex justify-between">
                        <div className="flex items-center align-middle">
                            <FolderPlusIcon className="h-6 mr-4 text-white"/>
                            <span className="text-2xl/7 text-white font-medium">New Collection</span>
                        </div>
                        <XCircleIcon className="text-neutral-200 h-6 hover:text-neutral-50 cursor-pointer"
                                     onClick={() => setCreateNewCollection(false)}/>
                    </div>
                    <p className="text-neutral-200 justify-text py-8 text-base font-medium">
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

            }
            {
                browseCollections &&

                <div className="bg-neutral-50 p-8 rounded-xl">
                    <div className="flex justify-between">
                        <div className="flex items-center align-middle">
                            <FolderOpenIcon className="h-6 mr-4 text-sky-800"/>
                            <span className="text-2xl/7 text-sky-800 font-medium">Your Collections</span>
                        </div>
                        <div className="flex justify-end">
                            <ArrowPathIcon
                                className={`text-sky-700 h-6 hover:text-sky-900 mr-4 cursor-pointer hover:rotate-180 transition-transform duration-500 ${loadCollections ? 'animate-spin' : ''}`}
                                onClick={() => getCollections()}/>
                            <XCircleIcon className="text-sky-700 h-6 hover:text-sky-900 cursor-pointer"
                                         onClick={() => setBrowseCollections(false)}/>
                        </div>
                    </div>
                    <p className="text-base font-medium text-sky-700 py-8">All your collections in one place.</p>
                    {loadCollections ?
                        <div className="w-full flex justify-center align-middle text-center"><LoadingSpinner size={6}/>
                        </div> :
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
                                            title="Click to view this collection."
                                            key={collection.id}
                                            onClick={() => routeToCollection(collection.id)}
                                            className="group border-b hover:bg-neutral-100 border-neutral-200 cursor-pointer"
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
                                                <ChevronRightIcon
                                                    className="h-6 mx-4 text-sky-800 transition-transform duration-300 group-hover:animate-bounce-x"/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div> : <em className="text-sky-800 text-base font-medium">No collections found.</em>
                    }
                </div>

            }
        </div>
    )
}