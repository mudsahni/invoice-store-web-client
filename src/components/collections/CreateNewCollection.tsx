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
        <div
            className=" border-2 bg-sky-100 border-sky-800 sm:p-8 p-4 rounded-xl">
            <div className="flex justify-between">
                <div className="flex items-center align-middle text-sky-800">
                    <FolderPlusIcon className="sm:h-8 h-6 mr-4"/>
                    <span className="sm:text-4xl text-3xl font-bold">New Collection</span>
                </div>
                <XCircleIcon
                    className="text-sky-800 hover:text-indigo-900 h-6 hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onClick={() => setCreateNewCollection(false)}/>
            </div>
            <p className="text-sky-800 text-opacity-80 justify-text py-8 text-base font-medium">
                Easily upload and store multiple documents in a collection for streamlined processing. Once
                uploaded, your documents will be automatically parsed into structured data, enabling advanced
                functionalities such as searching, filtering, and exporting. Additionally, the processed data will
                be available for seamless integration into the GST pipeline.
            </p>


            <NewCollectionContextProvider>
                <NewCollectionTool/>
            </NewCollectionContextProvider>

            <div className="w-full my-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-sky-800 bg-opacity-20"></div>
                    <span
                        className="text-sky-800 text-opacity-20 font-medium text-xl tracking-widest">SUPPORTED FILE TYPES</span>
                    <div className="h-px flex-1 bg-sky-800 bg-opacity-20"></div>
                </div>

            </div>
            <div
                className="grid sm:grid-cols-4 grid-cols-2 gap-4 align-middle text-center overflow-hidden">
                {
                    [<>
                        <FileIcon className="sm:h-6 h-5 mt-[6px]"/>
                        <span>PDF</span>
                    </>,
                        <>
                            <ImageIcon className="sm:h-6 h-5 mt-[6px]"/>
                            <span>JPEG</span>
                        </>,
                        <>
                            <ImageIcon className="sm:h-6 h-5 mt-[6px]"/>
                            <span>PNG</span>
                        </>,
                        <>
                            <ImageIcon className="sm:h-6 h-5 mt-[6px]"/>
                            <span>TIFF</span>
                        </>
                    ].map((format, index) => (
                        <div key={index}
                             className="hover:text-opacity-40 transition-transform duration-500 font-medium sm:text-3xl text-2xl text-sky-800 text-opacity-20 flex align-middle text-center justify-center space-x-2 rounded-xl p-2">
                            {format}
                        </div>
                    ))
                }
            </div>


        </div>
    )
}