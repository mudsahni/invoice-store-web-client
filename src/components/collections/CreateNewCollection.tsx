import React from "react";
import {X, FileText, ImageIcon} from "lucide-react";
import {FolderPlusIcon} from "@heroicons/react/20/solid";
import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";

interface CreateNewCollectionProps {
    setCreateNewCollection: (value: boolean) => void;
}

export const CreateNewCollection: React.FC<CreateNewCollectionProps> = ({setCreateNewCollection}) => {
    // File type cards with their configurations
    const fileTypes = [
        {icon: FileText, label: 'PDF', color: 'sky'},
        {icon: ImageIcon, label: 'JPEG', color: 'indigo'},
        {icon: ImageIcon, label: 'PNG', color: 'blue'},
        {icon: ImageIcon, label: 'TIFF', color: 'purple'}
    ];

    return (
        <div
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-8xl w-full mx-auto transition-all">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-sky-50 to-sky-100 p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-sky-600 bg-opacity-10 p-2 rounded-lg">
                            <FolderPlusIcon className="h-8 w-8 text-sky-600"/>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800">New Collection</h1>
                    </div>
                    <button
                        onClick={() => setCreateNewCollection(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-gray-500"/>
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed ">
                    Upload and organize your documents in a collection for streamlined processing.
                    Your documents will be automatically converted into structured data,
                    enabling advanced search and filtering capabilities.
                </p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <NewCollectionContextProvider>
                    <NewCollectionTool/>
                </NewCollectionContextProvider>
            </div>

            {/* Footer Section - Supported File Types */}
            <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                <div className="relative py-3">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"/>
                    </div>
                    <div className="relative flex justify-center">
            <span className="px-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supported File Types
            </span>
                    </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-4 grid-cols-2 gap-3">
                    {fileTypes.map((format, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col items-center"
                        >
                            <format.icon className={`h-6 w-6 text-${format.color}-500 mb-2`}/>
                            <span className="text-sm font-medium text-gray-700">{format.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};