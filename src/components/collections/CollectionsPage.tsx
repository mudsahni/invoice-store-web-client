import React from 'react'
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {FolderOpenIcon, BookOpenIcon, FolderPlusIcon} from "@heroicons/react/20/solid";
import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";

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

export const CollectionsPage: React.FC<CollectionsPageProps> = () => {
    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <Breadcrumbs pages={[
                {name: 'Collections', href: '/collections', current: true},
            ]}/>
            <CollectionsPageHeader/>
            <div className="flex justify-center align-middle items-center sm:space-x-4 flex-wrap">
                <button
                    type="button"
                    className="sm:mt-0 mt-4 inline-flex items-center gap-x-1.5 rounded-md border-2 border-sky-800 px-[48px] py-3 text-lg font-medium text-sky-800 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                    <BookOpenIcon aria-hidden="true" className="mr-2 size-5 text-sky-800"/>
                    Browse Collections
                </button>
            </div>
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
        </div>
    )
}