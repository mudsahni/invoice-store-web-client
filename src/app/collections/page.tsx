'use client';

import React, {useState} from "react";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {CreateNewCollection} from "@/components/collections/CreateNewCollection";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import {collectionsService} from "@/services/collectionService";
import {CollectionsPage} from "@/components/collections/CollectionsPage";

interface Job {
    collection_id: string,
    collection_name: string,
    created_date: string
    created_by: string
    updated_date: string
    updated_by: string
    number_of_invoices: number
    status: string
    error: string
    invoices: { [key: string]: string }[]
}

const jobTableHeaders = [
    {
        key: 'collection_name',
        label: 'Name',
    },
    {
        key: 'created_date',
        label: 'Created Date',
    },
    {
        key: 'updated_date',
        label: 'Updated Date',
    },
    {
        key: 'updated_by',
        label: 'Updated By',
    },
    {
        key: 'number_of_invoices',
        label: 'Invoice Count',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

interface CacheData {
    timestamp: number;
    dataset: Job[];
}

// Cache configuration
const CACHE_KEY = 'jobs';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const clearCache = () => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (err) {
        console.error('Error clearing cache:', err);
    }
};

// Cache utility functions
const getCachedData = (): CacheData | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (err) {
        console.error('Error reading from cache:', err);
        return null;
    }
};

const setCachedData = (dataset: Job[]) => {
    try {
        const cacheData: CacheData = {
            timestamp: Date.now(),
            dataset: dataset
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
        console.error('Error writing to cache:', err);
    }
};

const isCacheValid = (cacheData: CacheData): boolean => {
    return Date.now() - cacheData.timestamp < CACHE_TTL;
};

export default function Collections() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const URI = `http://localhost:8080/api/v1/invoice-reader/collections?status=completed`
    const fetchAndCacheJobs = async (forceRefresh: boolean = false) => {
        try {

            if (!forceRefresh) {
                const cachedData = getCachedData();
                if (cachedData && isCacheValid(cachedData)) {
                    setJobs(cachedData.dataset);
                    setLastUpdated(new Date(cachedData.timestamp));
                    setIsLoading(false);
                    return;
                }
            }

            setIsLoading(true);
            const response = await collectionsService.getCollections()
            console.log(response)
            // if (!response.) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const jobs = await response.json();

            setJobs(jobs);
            setCachedData(jobs);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Manual refresh function
    const handleRefresh = async () => {
        clearCache();
        await fetchAndCacheJobs(true);
    };

    React.useEffect(() => {
        fetchAndCacheJobs();
    }, []);

    return (
        <ProtectedRoute>

            <div>
                <CollectionsPage/>
            </div>
        </ProtectedRoute>
    );
}