import React from 'react'
import {ArrowPathIcon, ChevronRightIcon, FolderOpenIcon} from "@heroicons/react/20/solid";
import {ChevronLeftIcon, XCircleIcon} from "lucide-react";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {getStatusStyles} from "@/components/collections/utils";

interface YourCollectionsTableProps {
    setBrowseCollections: (value: boolean) => void
    routeToCollection: (id: string) => void
    collections: any[]
    loadCollections: boolean
    handleRefresh: () => void
}


export const YourCollectionsTable: React.FC<YourCollectionsTableProps> = ({
                                                                              setBrowseCollections,
                                                                              routeToCollection,
                                                                              collections,
                                                                              loadCollections,
                                                                              handleRefresh
                                                                          }) => {

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const itemsPerPage = 5;

    // Calculate pagination values
    const totalPages = Math.ceil(collections.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCollections = collections.slice(startIndex, endIndex);

    // Pagination controls
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="dark:bg-gray-800 dark:border-2 dark:border-gray-700 bg-neutral-50 sm:p-8 p-4 rounded-xl">
            <div className="flex justify-between">
                <div className="flex items-center align-middle">
                    <FolderOpenIcon className="h-6 mr-4 dark:text-gray-200 text-sky-800"/>
                    <span
                        className="text-2xl/7 dark:text-gray-200 text-sky-800 font-medium">Your Collections</span>
                </div>
                <div className="flex justify-end align-middle items-center">
                    <div
                        className={`${loadCollections ? 'dark:bg-gray-400' : 'dark:bg-gray-200 bg-gray-800 dark:hover:bg-gray-100 hover:bg-gray-900 dark:text-gray-800 text-gray-200 cursor-pointer'} group font-medium rounded-md py-1 px-2 sm:text-sm mx-4 text-xs flex justify-center align-middle items-center`}
                        onClick={handleRefresh}
                    >
                        <ArrowPathIcon
                            className={` h-4 sm:mr-2 `}/>
                        <span className="sm:block hidden">Refresh</span>
                    </div>
                    <XCircleIcon
                        className="dark:text-gray-200 dark:hover:text-gray-100 hover:scale-105 text-sky-700 h-6 hover:text-sky-900 cursor-pointer"
                        onClick={() => setBrowseCollections(false)}/>
                </div>
            </div>
            <p className="text-base font-medium dark:text-gray-400 text-sky-700 py-8">All your collections in
                one place.</p>
            {loadCollections ?
                <div className="w-full flex justify-center align-middle text-center"><LoadingSpinner size={6}/>
                </div> :
                collections.length > 0 ?
                    <>
                        <div className="flow-root">
                            <table className="min-w-full">
                                <colgroup>
                                    <col className="w-full sm:w-1/3"/>
                                    <col className="sm:w-1/5"/>
                                    <col className="sm:w-1/5"/>
                                    <col className="sm:w-1/5"/>
                                    <col className="sm:w-1/5"/>
                                </colgroup>
                                <thead
                                    className="border-b dark:border-gray-600 border-neutral-300 dark:text-gray-200 text-sky-900">
                                <tr>
                                    <th scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-right text-sm font-semibold sm:table-cell"
                                    >
                                        Last Updated
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-right text-sm font-semibold sm:table-cell"
                                    >
                                        Type
                                    </th>
                                    <th scope="col"
                                        className="hidden sm:table-cell py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-0">
                                        Status
                                    </th>
                                    <th scope="col"
                                        className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-0">
                                        <span className="sr-only">Go to collection</span>
                                    </th>

                                </tr>
                                </thead>
                                <tbody>
                                {currentCollections.map((collection) => (
                                    <tr
                                        title="Click to view this collection."
                                        key={collection.id}
                                        onClick={() => routeToCollection(collection.id)}
                                        className="group border-b dark:hover:bg-gray-900 hover:bg-neutral-100 dark:border-gray-700 border-neutral-200 cursor-pointer"
                                    >
                                        <td className={`max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0 sm:border-0 border-l-2 ${getStatusStyles(collection.status).border}`}>
                                            <div
                                                className="font-semibold truncate dark:text-gray-300 text-sky-800 ml-1">{collection.name}</div>
                                            <div
                                                className="mt-1 truncate dark:text-gray-400 text-sky-800 text-opacity-80 ml-1">Id: {collection.id}
                                            </div>
                                            <em className="dark:text-gray-500 truncate text-sky-900 text-opacity-60 ml-1">Created
                                                on: {new Date(collection.createdAt.seconds * 1000).toDateString()}</em>
                                        </td>
                                        <td className="hidden px-3 py-5 text-right text-sm dark:text-gray-400 text-sky-800 sm:table-cell">
                                            <em>{collection.updatedAt ? new Date(collection.updatedAt.seconds * 1000).toDateString() :
                                                'Collection has not been updated.'}</em></td>
                                        <td className="hidden px-3 py-5 text-right text-sm text-sky-800 sm:table-cell">
                                            <div
                                                className="bg-sky-100 border-2 border-sky-800 text-xs text-sky-800 inline-flex justify-center p-1 rounded-md font-semibold">
                                                {collection.type}
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell py-5 pl-3 pr-4 text-right text-sm text-sky-800 sm:pr-0">
                                            <div
                                                className={`rounded-sm border-2 text-xs inline-flex justify-center p-2 sm:p-1 sm:rounded-md font-semibold ${getStatusStyles(collection.status).badge}`}>
                                                <span className="hidden sm:block">{collection.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 pl-3 pr-4 text-right text-sm sm:pr-0">
                                            <ChevronRightIcon
                                                className="h-6 mx-4 dark:text-gray-200 text-sky-800 transition-transform duration-300 group-hover:animate-bounce-x"/>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination UI */}
                        <div
                            className="mt-6 flex items-center justify-between pt-4">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={previousPage}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold dark:text-gray-200 text-sky-800 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold dark:text-gray-200 text-sky-800 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm dark:text-gray-400 text-sky-800">
                                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                        <span className="font-medium">
                                        {Math.min(endIndex, collections.length)}
                                    </span> of{' '}
                                        <span className="font-medium">{collections.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                         aria-label="Pagination">
                                        <button
                                            onClick={previousPage}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 dark:text-gray-200 text-sky-800 disabled:opacity-50 dark:hover:bg-gray-700 hover:bg-neutral-100"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                                        </button>

                                        {/* Page numbers */}
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPage(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    currentPage === index + 1
                                                        ? 'dark:bg-gray-700 bg-neutral-100 dark:text-white text-sky-800'
                                                        : 'dark:text-gray-200 text-sky-800 dark:hover:bg-gray-700 hover:bg-neutral-100'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextPage}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 dark:text-gray-200 text-sky-800 disabled:opacity-50 dark:hover:bg-gray-700 hover:bg-neutral-100"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>

                    </> :
                    <em className="dark:text-gray-400 text-sky-800 text-base font-medium">No collections
                        found.</em>
            }
        </div>

    )
}