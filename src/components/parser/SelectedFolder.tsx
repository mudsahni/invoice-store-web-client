import {FileText, ArrowLeft} from "lucide-react";
import React from "react";
import {useNewCollectionContext} from "@/components/parser/context/NewCollectionContext";
import {Checkbox} from "@/components/ui/checkbox";

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
                file.id === fileId ? { ...file, selected: !file.selected } : file
            )
        );
    };

    const handleSelections = () => {
        if (selectedCount === pdfFiles.length) {
            setPdfFiles(prevFiles =>
                prevFiles.map(file => ({ ...file, selected: false }))
            );
        } else {
            setPdfFiles(prevFiles =>
                prevFiles.map(file => ({ ...file, selected: true }))
            )
        }
    }
    // const handleSelectAll = () => {
    //     setPdfFiles(prevFiles =>
    //         prevFiles.map(file => ({ ...file, selected: true }))
    //     );
    // };
    //
    // const handleDeselectAll = () => {
    //     setPdfFiles(prevFiles =>
    //         prevFiles.map(file => ({ ...file, selected: false }))
    //     );
    // };
    //
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <div>
            <div className="flex justify-end mb-4">
                <div
                    className="flex text-theme-bg justify-center font-semibold tracking-normal align-middle bg-theme-bg border-2 border-theme-bg rounded-xl p-4 sm:min-w-[40%] min-w-full cursor-pointer bg-opacity-0 hover:bg-opacity-10"
                    onClick={handleBrowseClick}
                >
                    <span>
                        <ArrowLeft />
                    </span>
                    <span className="px-2 focus:scale-10 transition-transform">
                        Change Folder
                    </span>
                </div>
            </div>
        <div className="p-4 bg-theme-bg rounded-lg">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                multiple
            />
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <div className="space-x-2 pb-2">
                        {/*<Button*/}
                        {/*    className={buttonClasses}*/}
                        {/*    type="button"*/}
                        {/*    variant="outline"*/}
                        {/*    size="sm"*/}
                        {/*    onClick={() => handleSelectAll()}*/}
                        {/*    disabled={selectedCount === pdfFiles.length || pdfFiles.length === 0}*/}
                        {/*>*/}
                        {/*    Select All*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*    className={buttonClasses}*/}
                        {/*    type="button"*/}
                        {/*    variant="outline"*/}
                        {/*    size="sm"*/}
                        {/*    onClick={handleDeselectAll}*/}
                        {/*    disabled={selectedCount === 0 || pdfFiles.length === 0}*/}
                        {/*>*/}
                        {/*    Deselect All*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*    className={buttonClasses}*/}
                        {/*    type="button"*/}
                        {/*    variant="outline"*/}
                        {/*    size="sm"*/}
                        {/*    onClick={handleBrowseClick}*/}
                        {/*>*/}
                        {/*    Change Folder*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>

            <div className="border p-2 rounded-lg overflow-hidden">
                <div className={`${pdfFiles.length > 6 ? 'max-h-96' : ''} overflow-y-auto`}>
                    <div className="flex justify-between pr-4 pb-4">
                        <div>
                            <div className="text-sm text-theme-text text-opacity-80">
                                {selectedCount} of {pdfFiles.length} PDF files selected
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                            </div>
                            <Checkbox title={selectedCount === pdfFiles.length ? 'Deselect All' : 'Select All'} id={'all'} selected={selectedCount === pdfFiles.length} toggle={handleSelections}/>
                        </div>
                    </div>
                    {pdfFiles.map((file) => (
                        <div
                            key={file.id}
                            onClick={() => toggleFileSelection(file.id)}
                            className={`flex cursor-pointer items-center px-4 py-3 rounded-lg mb-2 ${file.selected ? 'bg-secondary-600 bg-opacity-20 border-[1px] border-secondary-600' : 'border-opacity-10 border-theme-text border-b-[1px] hover:bg-theme-text transition-colors duration-200 hover:bg-opacity-10'}`}
                        >
                            <div className="flex items-center min-w-0 flex-1">

                                <FileText className={`h-6 w-6 ${file.selected ? 'text-secondary-600' : 'text-theme-text opacity-60'} mr-2 shrink-0`} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-theme-text tracking-wide truncate">
                                        {file.webkitRelativePath ? file.webkitRelativePath.split('/').pop() : file.name}
                                    </p>
                                    <p className="text-xs text-theme-text truncate">
                                        {file.webkitRelativePath || file.name}
                                    </p>
                                </div>
                                <Checkbox title={`Select ${file.name}`} id={file.id} selected={file.selected} toggle={toggleFileSelection} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/*{pdfFiles.length > 0 && (*/}
            {/*    <Button*/}
            {/*        type="submit"*/}
            {/*        disabled={isProcessing || selectedCount === 0}*/}
            {/*        className="w-full"*/}
            {/*    >*/}
            {/*        {isProcessing ? (*/}
            {/*            <>*/}
            {/*                <Loader2 className="animate-spin h-5 w-5 mr-2" />*/}
            {/*                Processing {selectedCount} files...*/}
            {/*            </>*/}
            {/*        ) : (*/}
            {/*            <>*/}
            {/*                <Upload className="h-5 w-5 mr-2" />*/}
            {/*                Process {selectedCount} Selected Files*/}
            {/*            </>*/}
            {/*        )}*/}
            {/*    </Button>*/}
            {/*)}*/}
        </div>
            </div>
    )
}