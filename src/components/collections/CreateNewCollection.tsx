import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";
import React from "react";
import {FolderPlusIcon} from "@heroicons/react/20/solid";
import {XCircleIcon} from "lucide-react";

interface CreateNewCollectionProps {
    setCreateNewCollection: (value: boolean) => void
}

export const CreateNewCollection: React.FC<CreateNewCollectionProps> = ({setCreateNewCollection}) => {
    return (
        <div
            className="dark:bg-gray-800 border-2 dark:border-gray-700 bg-blue-600 border-blue-500 sm:p-8 p-4 rounded-xl">
            <div className="flex justify-between">
                <div className="flex items-center align-middle">
                    <FolderPlusIcon className="h-6 mr-4 text-gray-200"/>
                    <span className="text-2xl/7 dark:text-gray-200 text-blue-100 font-medium">New Collection</span>
                </div>
                <XCircleIcon
                    className="dark:text-gray-300 text-blue-100 hover:text-blue-50 h-6 dark:hover:text-gray-100 hover:scale-105 cursor-pointer"
                    onClick={() => setCreateNewCollection(false)}/>
            </div>
            <p className="dark:text-gray-400 text-blue-100 justify-text py-8 text-base font-medium">
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
    )
}