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
        <div className="rounded-lg bg-yellow-50">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />

            <div className="p-4"> {/* Added consistent padding */}
                <div className="border border-yellow-800 rounded-lg">
                    <div className={` px-2 ${pdfFiles.length > 6 ? 'max-h-96' : ''} overflow-y-auto space-y-4`}>

                        <div
                            className="flex justify-between pr-2 pb-4 px-2 pl-3 pt-4 border-b border-yellow-800 border-opacity-20 align-middle items-center">
                            <div className="text-sm dark:text-gray-50 text-yellow-800 text-opacity-80">
                                {selectedCount} of {pdfFiles.length} PDF files selected
                            </div>
                            <div className="flex align-middle items-center">
                                <div
                                    className="flex border-yellow-800 text-yellow-800 border-2 rounded-md justify-center items-center align-middle px-2 py-1 mr-4 cursor-pointer hover:bg-yellow-100"
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
                                className={`flex cursor-pointer items-center px-2 py-3 rounded-lg mb-2 ${file.selected ? 'bg-green-500 bg-opacity-20 border-[1px] border-green-600' : 'border-opacity-10 border-yellow-800 border-b-[1px] hover:bg-yellow-100 transition-colors duration-200'}`}
                            >
                                <div className="flex items-center min-w-0 flex-1">

                                    <FileText
                                        className={`h-6 w-6 ${file.selected ? 'text-green-600' : 'text-yellow-800 opacity-60'} mr-2 shrink-0`}/>
                                    <div className="min-w-0 flex-1 sm:mr-0 mr-4">
                                        <p className={`${file.selected ? 'text-green-800' : 'text-yellow-800'} text-sm  tracking-wide truncate`}>
                                            {file.webkitRelativePath ? file.webkitRelativePath.split('/').pop() : file.name}
                                        </p>
                                        <p className={`${file.selected ? 'text-green-800' : 'text-yellow-800'} text-xs  text-opacity-60 truncate`}>
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