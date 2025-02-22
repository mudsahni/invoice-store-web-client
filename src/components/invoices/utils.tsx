import React from 'react'
import {ExclamationCircleIcon} from "@heroicons/react/16/solid";


interface DocumentFieldProps {
    label: string,
    type: string,
    path: string,
    handleOnChange: (path: string, value: string) => void,
    disabled: boolean,
    value?: string | number,
    error?: string,
}

export const DocumentField: React.FC<DocumentFieldProps> = ({
                                                                label,
                                                                type,
                                                                path,
                                                                handleOnChange,
                                                                disabled,
                                                                value,
                                                                error
                                                            }) => {
    return (
        <div>
            {
                type === 'textarea' ? (
                    <>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <textarea
                            disabled={disabled}
                            value={value}
                            onChange={(e) => handleOnChange(path, e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            rows={3}
                        />
                    </>

                ) : (
                    <>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <input
                            disabled={disabled}
                            type={type}
                            value={value}
                            onChange={(e) => handleOnChange(path, e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                        />
                    </>
                )
            }
            {
                error &&
                <div
                    className="flex rounded-md align-middle items-center space-x-4 justify-start bg-red-50 text-red-800 border text-sm py-1 px-2 my-2 border-red-800">
                    <ExclamationCircleIcon className="h-5"/>
                    <span>{error}</span>
                </div>
            }
        </div>
    )
}