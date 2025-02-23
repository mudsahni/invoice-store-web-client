import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";
import React from "react";
import {FolderPlusIcon} from "@heroicons/react/20/solid";
import {FileIcon, ImageIcon, XCircleIcon} from "lucide-react";
import {PhotoIcon} from "@heroicons/react/24/outline";

interface CreateNewCollectionProps {
    setCreateNewCollection: (value: boolean) => void
}

export const CreateNewCollection: React.FC<CreateNewCollectionProps> = ({setCreateNewCollection}) => {
    return (
        <div className="bg-sky-50 border-2 border-sky-800 border-opacity-40 rounded-xl">
            {/* Header Section */}
            <div className="p-6 border-b border-sky-800 border-opacity-20">
                <div className="flex justify-between items-center">
                    <div className="flex align-middle items-center justify-between space-x-2">
                        <div>
                            <FolderPlusIcon className="sm:h-10 sm:w-10 h-8 w-8 text-sky-800"/>
                        </div>
                        <h1 className="sm:text-4xl text-3xl font-bold text-sky-800">New Collection</h1>
                    </div>
                    <button
                        onClick={() => setCreateNewCollection(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XCircleIcon className="h-5 w-5 text-gray-500"/>
                    </button>
                </div>

                <p className="mt-4 text-base text-sky-800 leading-relaxed">
                    Easily upload and store multiple documents in a collection for streamlined processing.
                    Your documents will be automatically parsed into structured data, enabling advanced search and
                    filtering.
                </p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <NewCollectionContextProvider>
                    <NewCollectionTool/>
                </NewCollectionContextProvider>
            </div>

            {/* Footer Section */}
            <div className="px-6 pb-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gradient-to-br from-gray-50 to-sky-50/30 text-gray-500">
                            SUPPORTED FILE TYPES
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-4 grid-cols-2 gap-4">
                    {[
                        {icon: FileIcon, label: 'PDF', color: 'sky'},
                        {icon: ImageIcon, label: 'JPEG', color: 'indigo'},
                        {icon: ImageIcon, label: 'PNG', color: 'blue'},
                        {icon: ImageIcon, label: 'TIFF', color: 'purple'}
                    ].map((format, index) => (
                        <div
                            key={index}
                            className="group relative rounded-lg p-4 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <format.icon className={`h-6 w-6 text-${format.color}-600`}/>
                                <span className="text-sm font-medium text-gray-900">{format.label}</span>
                            </div>
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}