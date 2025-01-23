'use client';

import {useAuth} from "@/contexts/AuthContext";
import {Table} from "@/components/ui/datatable/table";
import React, {useState} from "react";
import {RefreshCw} from "lucide-react";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {StatusType} from "@/components/ui/status";
import {CreateNewCollection} from "@/components/parser/CreateNewCollection";
import Steps from "@/components/Steps";
import ProtectedRoute from "@/contexts/ProtectedRoute";

// LoadingSkeleton component
const LoadingSkeleton = () => {
    return (
        <div className="w-full py-4 animate-pulse">
            <div className="grid gap-4">

                {/* Table rows skeleton */}
                {[1,2].map((i) => (
                    <div key={i} className="grid grid-cols-1 gap-4">
                        {/* Adjust grid-cols to match your table columns */}
                        <div className="h-8 bg-gray-200 rounded-md" />
                        <div className="h-8 bg-gray-200 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};


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
    invoices: {[key: string]: string}[]
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

export default function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const {authUser, tenant, loading} = useAuth();

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
            const response = await fetch(URI);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jobs = await response.json();

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
            <div className="p-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs/>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl dark:text-white text-slate-600 font-bold tracking">Invoice
                            Collections</h1>
                    </div>
                    <p className="text-gray-800 dark:text-gray-100 py-4 text-base tracking-wide">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                        but also the leap into electronic typesetting, remaining essentially unchanged. It was
                        popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                        and more recently with desktop publishing software like Aldus PageMaker including versions of
                        Lorem Ipsum.
                    </p>
                    <div className="flex justify-between items-center mb-4 pt-4">
                        <h2 className="text-2xl dark:text-gray-200 text-slate-600 font-bold">Upload a New
                            Collection</h2>
                    </div>
                    <p className="text-gray-800 dark:text-gray-100 pb-4 text-base tracking-wide">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                        but also the leap into electronic typesetting, remaining essentially unchanged. It was
                        popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                        and more recently with desktop publishing software like Aldus PageMaker including versions of
                        Lorem Ipsum.
                    </p>
                    <Steps/>

                    <div className="sm:max-w-5xl mx-auto">

                        <CreateNewCollection/>
                    </div>


                    {/*<FolderSelection />*/}
                </div>

            </div>

            {error && (
                <div className="text-red-500 mb-4">
                    Error: {error}
                </div>
            )}
            <div className="py-8 mx-auto max-w-7xl lg:px-0 px-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-slate-600">Browse Your Invoice Collections</h1>
                </div>
                <p className="text-slate-600">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <div className="flex items-end justify-end gap-4">
                    {lastUpdated && (
                        <span className="text-sm text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform duration-1000 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
                    </button>
                </div>

                {!isLoading && !error && jobs.length > 0 && (

                    <Table
                        headers={jobTableHeaders}
                        dataset={jobs}
                        statusColumn={'status'}
                        statusColumnMapping={{
                            completed: StatusType.Success,
                            failed: StatusType.Error,
                            in_progress: StatusType.Info
                        }}
                        userColumns={["created_by", "updated_by"]}
                        columnsWithMetadataFields={{
                            'collection_name': ['created_date', 'number_of_invoices'],
                            'updated_by': ['updated_date']
                        }}

                    />
                )}

                {!isLoading && !error && jobs.length === 0 && (
                    <div>No completed jobs found.</div>
                )}
            </div>
        </div>
        </ProtectedRoute>
    );
}