import React from 'react'
import {FolderOpen} from "lucide-react";

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        webkitdirectory?: string | boolean;
        directory?: string | boolean;
    }
}


interface FolderSelectionProps {
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FolderSelection: React.FC<FolderSelectionProps> = ({
                                                                    fileInputRef,
                                                                    handleFolderSelect
                                                                }) => {

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-1 dark:bg-gray-700 bg-blue-50  rounded-xl p-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />


            <div
                className="group flex min-h-[300px] dark:bg-gray-700 bg-blue-50 flex-col items-center justify-center border-2 border-dashed dark:border-gray-50 border-blue-700 border-opacity-40 rounded-lg p-6 cursor-pointer hover:border-opacity-80 transition-colors"
                onClick={handleBrowseClick}
            >
                <FolderOpen
                    className="h-12 w-12 dark:text-gray-200 text-blue-800 text-opacity-80 mb-3 group-hover:text-opacity-100 transition-transform"/>
                <div className="text-center">
                    <p className="text-sm dark:text-gray-200 text-blue-800">Click to select a folder</p>
                    <p className="text-xs dark:text-gray-200 text-blue-800 text-opacity-80 mt-1">Only PDF files will be
                        processed</p>
                </div>
            </div>


        </div>
    )
}