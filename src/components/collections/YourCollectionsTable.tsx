import React from 'react'
import {ArrowPathIcon, ChevronRightIcon} from "@heroicons/react/20/solid";
import {ChevronLeftIcon} from "lucide-react";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {getStatusStyles} from "@/components/collections/utils";
import {FaceFrownIcon} from "@heroicons/react/24/outline";

interface YourCollectionsTableProps {
    routeToCollection: (id: string) => void
    collections: any[]
    loadCollections: boolean
    handleRefresh: () => void
}


export const YourCollectionsTable: React.FC<YourCollectionsTableProps> = ({
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
        <div
            className="dark:bg-gray-800 dark:border-2 dark:border-gray-700 bg-neutral-50 sm:p-8 p-4 rounded-xl min-h-[50vh]">
            <div className="flex w-full h-full justify-between align-middle items-center mb-8">
                <span className="text-gray-700 font-bold sm:text-4xl text-3xl">Browse Collections</span>
                <div
                    className={`${loadCollections ? 'bg-blue-600 bg-opacity-45' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white group rounded-md p-2 group overflow-hidden transition-all duration-300 font-semibold sm:text-sm mx-4 text-xs flex justify-center align-middle items-center`}
                    onClick={handleRefresh}
                >
                    <ArrowPathIcon
                        className='h-6'/>
                    <span
                        className="sm:block text-base hidden overflow-hidden w-0 group-hover:w-[4rem] transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-2">Refresh</span>
                </div>
            </div>
            {loadCollections ?
                <div className="w-full h-[50vh] flex justify-center align-bottom text-center">
                    <div className="flex flex-col align-middle justify-center items-center">
                        <LoadingSpinner size={9} className={"text-gray-200 fill-gray-400"}/>
                    </div>
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
                                    className="border-b dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-800">
                                <tr className="text-sm font-semibold">
                                    <th scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left sm:pl-0">
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-right sm:table-cell"
                                    >
                                        Last Updated
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-right sm:table-cell"
                                    >
                                        Type
                                    </th>
                                    <th scope="col"
                                        className="hidden sm:table-cell py-3.5 pl-3 pr-4 text-right sm:pr-0">
                                        Status
                                    </th>
                                    <th scope="col"
                                        className="py-3.5 pl-3 pr-4 text-right sm:pr-0">
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
                                        className="group border-b dark:hover:bg-gray-900 hover:bg-gray-100 dark:border-gray-700 border-gray-200 cursor-pointer"
                                    >
                                        <td className={`max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0 sm:border-0 border-l-2 ${getStatusStyles(collection.status).border}`}>
                                            <div
                                                className="font-semibold truncate dark:text-gray-300 text-gray-700 ml-1">{collection.name}</div>
                                            <div
                                                className="mt-1 truncate dark:text-gray-400 text-gray-600 text-opacity-80 ml-1">Id: {collection.id}
                                            </div>
                                            <em className="dark:text-gray-500 truncate text-gray-500 text-opacity-60 ml-1">Created
                                                on: {new Date(collection.createdAt.seconds * 1000).toDateString()}</em>
                                        </td>
                                        <td className="hidden px-3 py-5 text-right text-sm dark:text-gray-400 text-gray-800 sm:table-cell">
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
                                    className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold dark:text-gray-200 text-gray-800 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold dark:text-gray-200 text-gray-800 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm dark:text-gray-400 text-gray-800">
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
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 dark:text-gray-200 text-gray-800 disabled:opacity-50 dark:hover:bg-gray-700 hover:bg-neutral-100"
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
                                                        ? 'dark:bg-gray-700 bg-neutral-100 dark:text-white text-gray-800'
                                                        : 'dark:text-gray-200 text-gray-800 dark:hover:bg-gray-700 hover:bg-neutral-100'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextPage}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 dark:text-gray-200 text-gray-800 disabled:opacity-50 dark:hover:bg-gray-700 hover:bg-gray-100"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>

                    </> :
                    <div className="w-full h-[50vh] flex items-center align-bottom justify-center">
                        <div className="flex flex-col align-middle justify-center items-center">
                            <FaceFrownIcon className="sm:h-16 h-12 text-gray-800 text-opacity-40 mb-4"/>
                            <em className="text-gray-800 text-opacity-40 text-base font-medium">No collections
                                were found.</em>
                        </div>
                    </div>
            }
        </div>

    )
}