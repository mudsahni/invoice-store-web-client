import {CollectionStatus, CollectionWithDocuments, ErrorSeverity} from "@/types/collections";
import React from 'react'
import {
    ArchiveBoxXMarkIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/20/solid'
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {ExclamationCircleIcon} from "@heroicons/react/16/solid";

const COLLECTION_CACHE_PREFIX = "collection_"
// Cache configuration
const COLLECTION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const clearCache = (collectionId: string) => {
    try {
        localStorage.removeItem(COLLECTION_CACHE_PREFIX + collectionId);
    } catch (err) {
        console.error('Error clearing cache:', err);
    }
};

interface CollectionCacheData {
    timestamp: number;
    collectionWithDocuments: CollectionWithDocuments;
}

// Cache utility functions
export const getCollectionCachedData = (collectionId: string): CollectionCacheData | null => {
    try {
        const cached = localStorage.getItem(COLLECTION_CACHE_PREFIX + collectionId);
        return cached ? JSON.parse(cached) : null;
    } catch (err) {
        console.error('Error reading from cache:', err);
        return null;
    }
};

export const setCollectionCachedData = (collectionId: string, collectionWithDocuments: CollectionWithDocuments) => {
    try {
        const cacheData: CollectionCacheData = {
            timestamp: Date.now(),
            collectionWithDocuments: collectionWithDocuments
        };
        localStorage.setItem(COLLECTION_CACHE_PREFIX + collectionId, JSON.stringify(cacheData));
    } catch (err) {
        console.error('Error writing to cache:', err);
    }
};

export const isCollectionCacheValid = (cacheData: CollectionCacheData): boolean => {
    if (cacheData.collectionWithDocuments.status !== CollectionStatus.COMPLETED) {
        return false
    }
    if (Date.now() - cacheData.timestamp < COLLECTION_CACHE_TTL) {
        return true
    } else {
        clearCache(cacheData.collectionWithDocuments.id)
        return false
    }
};

interface CollectionStatusComponentProps {
    status: string;
    size: 'large' | 'medium' | 'small';
}

interface BadgeProps {
    size: 'large' | 'medium' | 'small';
}

interface StatusBadge {
    status: string;
}

export const StatusBadge: React.FC<StatusBadge> = ({status}) => {
    return (
        <div
            className={`max-w-24 sm:max-w-32 flex items-center badge badge-warning bg-yellow-100 border-[1px] border-yellow-800 sm:p-2 p-1 sm:rounded-lg rounded-md sm:mt-0 sm:ml-2`}
        >
            <CheckCircleIcon className={`h-4 text-yellow-800 mr-2`}/>
            <span className="truncate text-yellow-800 text-xs font-semibold">{status}</span>
        </div>
    )
}
export const SuccessBadge: React.FC<BadgeProps> = ({size}) => {
    return (
        <div
            className={`max-w-24 sm:max-w-32 flex items-center badge badge-warning bg-green-100 border-[1px] border-green-600 sm:p-2 p-1 sm:rounded-lg rounded-md sm:mt-0 sm:ml-2`}
        >
            <CheckCircleIcon className={`sm:h-4 h-3 text-green-600 mr-2`}/>
            <span className="truncate text-green-600 sm:text-sm text-xs font-semibold">Completed</span>
        </div>
    )
}

export const InProgressBadge: React.FC<BadgeProps> = ({size}) => {

    return (
        <div
            className={`max-w-24 sm:max-w-32 flex items-center badge badge-warning bg-indigo-100 border-[1px] border-indigo-600 sm:p-2 p-1 sm:rounded-lg rounded-md sm:mt-0 sm:ml-2`}>
            <div role="status">
                <LoadingSpinner size={4} className="mr-2 text-indigo-600"/>
                <span className="sr-only">Loading...</span>
            </div>
            <span
                className="truncate text-indigo-600 sm:text-sm text-xs">
                In Progress
            </span>
        </div>
    )
}

export const CollectionStatusComponent: React.FC<CollectionStatusComponentProps> = ({status, size}) => {
    if (status === "COMPLETED") {
        return <SuccessBadge size={size}/>
    }
    return <InProgressBadge size={size}/>
}

const MENU_ITEM_BOX_CLASSES = "px-4 py-2 flex align-middle items-center data-[focus]:bg-sky-100 data-[focus]:text-sky-700 data-[focus]:outline-none"
const MENU_ITEM_CLASSES = "text-sm text-sky-700"

export const getOptionsMenu = (collectionId: string, documentId: string, downloadLink: string) => [
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href={`/collections/${collectionId}/${documentId}`}
    >
        <PencilSquareIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
      Review and Edit
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href={`${downloadLink}`}
        target={"_blank"}
    >
        <ArrowDownTrayIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
       Download File
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <ArchiveBoxXMarkIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
      Delete Document
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <ArrowPathIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
     Refresh
    </span>
    </a>,


]

interface ErrorDisplayProps {
    errors: { [key: string]: { field: string, message: string, severity?: ErrorSeverity } }
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({errors}) => {
    console.log(errors)
    // Return early if errors is undefined or empty
    if (!errors || Object.keys(errors).length === 0) {
        return <span>No errors</span>;
    }

    // Filter errors by severity with proper type checking
    const criticalErrorsCount = Object.values(errors).filter(
        (error) => error.severity?.toString().toUpperCase() === ErrorSeverity.CRITICAL.toString()
    ).length;
    console.log(criticalErrorsCount)
    const majorErrorsCount = Object.values(errors).filter(
        (error) => error.severity?.toString().toUpperCase() === ErrorSeverity.MAJOR.toString()
    ).length;

    const minorErrorsCount = Object.values(errors).filter(
        (error) => error.severity?.toString().toUpperCase() === ErrorSeverity.MINOR.toString()
    ).length;

    // If no categorized errors are found, check if there are any errors without severity

    return (
        <div className="flex flex-col items-start justify-start align-middle">
            {criticalErrorsCount > 0 && (
                <div
                    className="bg-red-50 text-red-800 border-red-800 flex rounded-md items-center space-x-2 justify-start border text-sm py-1 px-2 my-2 w-full">
                    <ExclamationCircleIcon className="h-5 flex-shrink-0"/>
                    <span>{criticalErrorsCount} critical errors</span>
                </div>
            )}

            {majorErrorsCount > 0 && (
                <div
                    className="bg-orange-50 text-orange-800 border-orange-800 flex rounded-md items-center align-middle space-x-2 justify-start border text-sm py-1 px-2 my-2 w-full">
                    <ExclamationCircleIcon className="h-5 flex-shrink-0"/>
                    <span>{majorErrorsCount} major errors</span>
                </div>
            )}

            {minorErrorsCount > 0 && (
                <div
                    className="bg-yellow-50 text-yellow-800 border-yellow-800 flex rounded-md items-center align-middle justify-start space-x-2 border text-sm py-1 px-2 my-2 w-[80%]">
                    <ExclamationCircleIcon className="h-5 flex-shrink-0"/>
                    <span>{minorErrorsCount} minor errors</span>
                </div>
            )}


            {/* Show "No errors" only if there are no errors at all */}
            {minorErrorsCount === 0 && majorErrorsCount === 0 && criticalErrorsCount === 0 && (
                <span>No errors</span>
            )}
        </div>
    );
};
