'use client'

import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import React from "react";

interface NotificationProps {
    show: boolean
    setShow: (show: boolean) => void
}

export const Notification: React.FC<NotificationProps> = ({show, setShow}) => {

    return (
            <div
                aria-live="assertive"
                className="absolute z-10 right-[32rem] top-[4.5rem] w-full" // Position absolute relative to parent
            >
                <div className="flex flex-col items-end space-y-4">
                    <Transition show={show}>
                        <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="shrink-0">
                                        <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Successfully saved!</p>
                                        <p className="mt-1 text-sm text-gray-500">Anyone with a link can now view this file.</p>
                                    </div>
                                    <div className="ml-4 flex shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShow(false)
                                            }}
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon aria-hidden="true" className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
    )
}