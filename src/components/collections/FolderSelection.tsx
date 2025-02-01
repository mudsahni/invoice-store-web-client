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
        <div className="space-y-1 bg-theme-bg rounded-lg p-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />


            <div
                className="group flex min-h-[300px] bg-theme-bg flex-col items-center justify-center border-2 border-dashed border-theme-text border-opacity-40 rounded-lg p-6 cursor-pointer hover:border-opacity-80 transition-colors"
                onClick={handleBrowseClick}
            >
                <FolderOpen className="h-12 w-12 text-theme-text text-opacity-80 mb-3 group-hover:text-opacity-100 transition-transform" />
                <div className="text-center">
                    <p className="text-sm text-theme-text">Click to select a folder</p>
                    <p className="text-xs text-theme-text text-opacity-80 mt-1">Only PDF files will be processed</p>
                </div>
            </div>


        </div>
    )
}