import React from "react";
import {FileText, FolderOpen, CheckCircle, Circle} from "lucide-react";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";

interface SelectedFolderProps {
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SelectedFolder: React.FC<SelectedFolderProps> = ({
                                                                  fileInputRef,
                                                                  handleFolderSelect
                                                              }) => {
    const {
        pdfFiles,
        setPdfFiles,
    } = useNewCollectionContext();

    const selectedCount = pdfFiles.filter(file => file.selected).length;

    const toggleFileSelection = (fileId: string) => {
        setPdfFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === fileId ? {...file, selected: !file.selected} : file
            )
        );
    };

    const handleSelections = () => {
        if (selectedCount === pdfFiles.length) {
            setPdfFiles(prevFiles =>
                prevFiles.map(file => ({...file, selected: false}))
            );
        } else {
            setPdfFiles(prevFiles =>
                prevFiles.map(file => ({...file, selected: true}))
            );
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <FolderOpen className="h-5 w-5 text-sky-600"/>
                        <span className="font-medium text-gray-800">Files</span>
                        <span className="text-sm text-gray-500">
              {selectedCount} of {pdfFiles.length} selected
            </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBrowseClick}
                            className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors flex items-center space-x-1"
                        >
                            <span>Change folder</span>
                        </button>
                        <button
                            onClick={handleSelections}
                            className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {selectedCount === pdfFiles.length ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-sky-600"/>
                                    <span>Deselect all</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4 text-gray-400"/>
                                    <span>Select all</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* File List */}
                <div className={`${pdfFiles.length > 6 ? 'max-h-96' : ''} overflow-y-auto`}>
                    {pdfFiles.map((file) => (
                        <div
                            key={file.id}
                            onClick={() => toggleFileSelection(file.id)}
                            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                file.selected ? 'bg-sky-50' : ''
                            }`}
                        >
                            <div className="min-w-0 flex-1 flex items-center">
                                <FileText
                                    className={`h-5 w-5 ${file.selected ? 'text-sky-600' : 'text-gray-400'} mr-3 shrink-0`}/>

                                <div className="min-w-0 flex-1 mr-4">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {file.webkitRelativePath ? file.webkitRelativePath.split('/').pop() : file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {file.webkitRelativePath || file.name}
                                    </p>
                                </div>

                                {file.selected ? (
                                    <CheckCircle className="h-5 w-5 text-sky-600 shrink-0"/>
                                ) : (
                                    <Circle className="h-5 w-5 text-gray-300 shrink-0"/>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};