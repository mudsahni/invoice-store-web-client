import {CollectionStatus, CollectionWithDocuments} from "@/types/collections";
import React from 'react'
import {CheckCircleIcon} from '@heroicons/react/20/solid'
import {LoadingSpinner} from "@/components/LoadingSpinner";
import ReactDOM from 'react-dom';

const CACHE_PREFIX = "collection_"
// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const clearCache = (collectionId: string) => {
    try {
        localStorage.removeItem(CACHE_PREFIX + collectionId);
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
        const cached = localStorage.getItem(CACHE_PREFIX + collectionId);
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
        localStorage.setItem(CACHE_PREFIX + collectionId, JSON.stringify(cacheData));
    } catch (err) {
        console.error('Error writing to cache:', err);
    }
};

export const isCollectionCacheValid = (cacheData: CollectionCacheData): boolean => {
    if (cacheData.collectionWithDocuments.status !== CollectionStatus.COMPLETED) {
        return false
    }
    if (Date.now() - cacheData.timestamp < CACHE_TTL) {
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

interface PortalProps {
    children: React.ReactNode;
}

export const Portal: React.FC<PortalProps> = ({children}) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return ReactDOM.createPortal(children, document.body);
};
