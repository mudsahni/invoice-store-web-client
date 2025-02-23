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
        <div className="rounded-lg p-2 bg-sky-100">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />
            <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer rounded-lg bg-sky-50 border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
                <div className="mx-auto flex flex-col items-center">
                    <FolderOpen
                        className="h-12 w-12 text-gray-400 group-hover:text-sky-600 transition-colors duration-300"/>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-900">
                            Click to select a folder
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Only PDF files will be processed
                        </p>
                    </div>
                </div>
                <div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/5 to-gray-50/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
        </div>
    )
}