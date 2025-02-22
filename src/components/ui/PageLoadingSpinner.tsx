import React from 'react'
import {LoadingSpinner} from "@/components/LoadingSpinner";

interface PageLoadingSpinnerProps {

}

export const PageLoadingSpinner: React.FC<PageLoadingSpinnerProps> = () => {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-100 z-50">
            <LoadingSpinner size={12} className={"text-gray-500"}/>
        </div>
    )
}