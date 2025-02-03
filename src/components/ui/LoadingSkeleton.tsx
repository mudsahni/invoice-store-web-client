import React from 'react'

export const LoadingSkeleton = () => {
    return (

        <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="flex items-center w-full">
                <div className="h-2.5 bg-sky-200 rounded-full dark:bg-sky-700 w-32"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-24"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
            </div>
            <div className="flex items-center w-full max-w-[480px]">
                <div className="h-2.5 bg-sky-200 rounded-full dark:bg-sky-700 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-24"></div>
            </div>
            <div className="flex items-center w-full max-w-[400px]">
                <div className="h-2.5 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-200 rounded-full dark:bg-sky-700 w-80"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
            </div>
            <div className="flex items-center w-full max-w-[480px]">
                <div className="h-2.5 ms-2 bg-sky-200 rounded-full dark:bg-sky-700 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-24"></div>
            </div>
            <div className="flex items-center w-full max-w-[440px]">
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-32"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-24"></div>
                <div className="h-2.5 ms-2 bg-sky-200 rounded-full dark:bg-sky-700 w-full"></div>
            </div>
            <div className="flex items-center w-full max-w-[360px]">
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-sky-200 rounded-full dark:bg-sky-700 w-80"></div>
                <div className="h-2.5 ms-2 bg-sky-300 rounded-full dark:bg-sky-600 w-full"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>

    )
}