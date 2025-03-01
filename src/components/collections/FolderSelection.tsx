import React from 'react';
import {FolderUp} from "lucide-react";

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
    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,application/pdf,image/jpeg,image/png,image/tiff"
                multiple
            />
            <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer transition-all duration-300 ease-in-out
                   bg-white border border-gray-200 hover:border-sky-500 hover:shadow-md
                   rounded-lg p-12 text-center flex flex-col items-center justify-center"
            >
                <div className="flex flex-col items-center transition-transform group-hover:scale-105 duration-300">
                    <div className="p-4 mb-3 bg-sky-50 rounded-full transition-colors group-hover:bg-sky-100">
                        <FolderUp
                            className="h-8 w-8 text-sky-600 group-hover:text-sky-700"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">
                        Select a folder
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Upload PDF files, JPG, PNG or TIFF images to create your collection
                    </p>
                    <button
                        className="mt-5 px-5 py-2 bg-sky-600 text-white rounded-lg
                     hover:bg-sky-700 transition-colors font-medium text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        Browse Folders
                    </button>
                </div>
                <p className="mt-6 text-xs text-gray-400">
                    Supported formats: PDF, JPG, PNG, TIFF
                </p>
            </div>
        </div>
    );
};