import {FileText, ArrowLeft} from "lucide-react";
import React from "react";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";
import {Checkbox} from "@/components/ui/checkbox";
import {ArrowUturnLeftIcon} from "@heroicons/react/16/solid";

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
            )
        }
    }
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="sm:w-full w-[80vw] dark:bg-gray-700 bg-blue-50 rounded-lg">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />

            <div className="p-4"> {/* Added consistent padding */}
                <div className="border dark:border-gray-500 border-blue-600 rounded-lg">
                    <div className={` px-2 ${pdfFiles.length > 6 ? 'max-h-96' : ''} overflow-y-auto space-y-4`}>

                        <div
                            className="flex justify-between pr-2 pb-4 px-2 pl-3 pt-4 border-b dark:border-gray-600 border-blue-100 align-middle items-center">
                            <div className="text-sm dark:text-gray-50 text-blue-900 text-opacity-80">
                                {selectedCount} of {pdfFiles.length} PDF files selected
                            </div>
                            <div className="flex align-middle items-center">
                                <div
                                    className="flex dark:bg-gray-700 dark:text-gray-300 dark:border-gray-300 border-blue-800 text-blue-800 border-2 rounded-md justify-center items-center align-middle px-2 py-1 mr-4 cursor-pointer dark:hover:bg-gray-600 hover:bg-blue-100"
                                    onClick={handleBrowseClick}
                                >
                                    <ArrowUturnLeftIcon
                                        className="h-4 sm:mr-2"
                                        title="Change Folder"/>
                                    <span
                                        className="text-sm font-medium sm:block hidden">Change Folder</span>
                                </div>
                                <Checkbox title={selectedCount === pdfFiles.length ? 'Deselect All' : 'Select All'}
                                          id={'all'} selected={selectedCount === pdfFiles.length}
                                          toggle={handleSelections}/>
                            </div>
                        </div>
                        {pdfFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => toggleFileSelection(file.id)}
                                className={`flex cursor-pointer items-center px-2 py-3 rounded-lg mb-2 ${file.selected ? 'bg-green-800 bg-opacity-20 border-[1px] dark:border-gray-600 border-blue-800' : 'border-opacity-10 dark:border-gray-50 border-blue-800 border-b-[1px] dark:hover:bg-gray-800 hover:bg-blue-800 transition-colors duration-200 hover:bg-opacity-10'}`}
                            >
                                <div className="flex items-center min-w-0 flex-1">

                                    <FileText
                                        className={`h-6 w-6 ${file.selected ? 'text-green-600' : 'dark:text-gray-50 text-blue-900 opacity-60'} mr-2 shrink-0`}/>
                                    <div className="min-w-0 flex-1 sm:mr-0 mr-4">
                                        <p className="text-sm dark:text-gray-50 text-blue-900 tracking-wide truncate">
                                            {file.webkitRelativePath ? file.webkitRelativePath.split('/').pop() : file.name}
                                        </p>
                                        <p className="text-xs dark:text-gray-50 text-blue-900 text-opacity-60 truncate">
                                            {file.webkitRelativePath || file.name}
                                        </p>
                                    </div>
                                    <Checkbox title={`Select ${file.name}`} id={file.id} selected={file.selected}
                                              toggle={toggleFileSelection}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}