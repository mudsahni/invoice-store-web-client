import {CollectionStatus, CollectionWithDocuments} from "@/types/collections";
import React from 'react'
import {
    ArchiveBoxXMarkIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/20/solid'
import {LoadingSpinner} from "@/components/LoadingSpinner";

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
                <LoadingSpinner size={4}/>
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

