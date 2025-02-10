import React, {useRef, useState} from "react";
import {PencilSquareIcon, PlusIcon} from "@heroicons/react/20/solid";
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";
import {LoadingSpinner} from "@/components/LoadingSpinner";

interface InputWithButtonProps {
    loading: boolean
    handleSubmit: (e: React.FormEvent) => Promise<void>,
}

export const InputWithButton: React.FC<InputWithButtonProps> = (
    {
        loading,
        handleSubmit
    }
) => {
    const [isFocused, setIsFocused] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const {
        collectionName,
        setCollectionName,
        setShowError
    } = useNewCollectionContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowError(false)
        setCollectionName(e.target.value)
    }

    return (
        <div className="relative lg:flex lg:justify-between" ref={componentRef}>
            <div
                className="w-full mr-4 flex align-middle items-center rounded-lg shadow-sm dark:bg-gray-700 bg-white border-[1px] dark:border-gray-500 border-blue-300 p-1 h-16 my-2">
                <PencilSquareIcon className="h-5 mr-2 dark:text-gray-200 text-blue-900 pl-4"/>
                <div
                    className={`flex rounded-lg flex-col flex-1 p-3 mt-1 mr-2 relative`}> {/* Added relative for floating label positioning */}
                    <label
                        className={`absolute transition-all duration-400 pointer-events-none
                    ${(isFocused || collectionName)
                            ? 'sm:text-sm text-xs dark:text-gray-400 dark:text-opacity-100 text-blue-900 text-opacity-40 transform -translate-y-[8px]'
                            : 'text-base sm:text-base dark:text-gray-400 dark:text-opacity-100 text-blue-900 text-opacity-40 transform translate-y-[3px]'}`}
                    >Enter a collection name
                    </label>
                    <input
                        type="text"
                        value={collectionName}
                        onChange={(e) => handleInputChange(e)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`dark:bg-gray-700 bg-white text-base pt-2 font-normal dark:text-gray-200 text-blue-900 focus:outline-none mt-1 w-full`}
                    />

                </div>
                <div className="flex h-16 my-2 justify-center lg:w-[40%] w-[20%] align-middle items-center">
                    <button
                        disabled={loading}
                        type="submit"
                        onClick={handleSubmit}
                        className={`${loading ? 'pointer-events-none dark:bg-blue-900 bg-green-900' : 'dark:bg-blue-600 bg-green-600 cursor-pointer dark:hover:bg-blue-700 hover:bg-green-700'} w-full rounded-lg dark:text-gray-50 text-green-50 text-base sm:text-lg font-semibold p-4`}
                    >
                        <div className="flex align-middle items-center justify-center">
                            {
                                loading ? <LoadingSpinner size={6}/> : <PlusIcon className="h-6 sm:mr-4"/>

                            }
                            <span className="hidden sm:block">Create Collection</span>
                        </div>

                    </button>
                </div>

            </div>
        </div>
    )
}