import React from 'react'
import {ArrowPathIcon, ChevronRightIcon} from "@heroicons/react/20/solid";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {getStatusStyles} from "@/components/collections/utils";
import {FaceFrownIcon} from "@heroicons/react/24/outline";
import TablePagination from "@/components/ui/Pagination";

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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Create a function to get current page data
    const getCurrentPageData = () => {
        return collections
            .slice(startIndex, endIndex);
    };


    // Get the current page documents
    const currentCollections = getCurrentPageData();

    return (
        <div
            className="dark:bg-gray-800 dark:border-2 dark:border-gray-700 bg-gray-50 sm:p-8 p-4 rounded-xl min-h-[50vh]">
            <div className="flex w-full h-full justify-between align-middle items-center mb-8">
                <span className="text-gray-700 font-bold sm:text-4xl text-3xl">Browse Collections</span>
                <div
                    className={`${loadCollections ? 'bg-gray-200 text-gray-400 border-2 border-gray-400' : 'bg-sky-100 hover:bg-sky-200 cursor-pointer text-sky-800 border-2 border-sky-800'} group rounded-md p-2 group overflow-hidden transition-all duration-300 font-semibold sm:text-sm mx-4 text-xs flex justify-center align-middle items-center`}
                    onClick={handleRefresh}
                >
                    <ArrowPathIcon
                        className={loadCollections ? 'animate-spin h-6' : 'h-6'}/>
                    {
                        !loadCollections && <span
                            className="sm:block text-base hidden overflow-hidden w-0 group-hover:w-[4rem] transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-2">Refresh</span>

                    }
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
                                        className="hidden px-3 py-3.5 text-left sm:table-cell"
                                    >
                                        Last Updated
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left sm:table-cell"
                                    >
                                        Type
                                    </th>
                                    <th scope="col"
                                        className="hidden sm:table-cell py-3.5 pl-3 pr-4 text-left sm:pr-0">
                                        Status
                                    </th>
                                    <th scope="col"
                                        className="py-3.5 pl-3 pr-4 text-left sm:pr-0">
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
                                        <td className="hidden px-3 py-5 text-left text-sm dark:text-gray-400 text-gray-800 sm:table-cell">
                                            <em>{collection.updatedAt ? new Date(collection.updatedAt.seconds * 1000).toDateString() :
                                                'Collection has not been updated.'}</em></td>
                                        <td className="hidden px-3 py-5 text-left text-sm text-sky-800 sm:table-cell">
                                            <div
                                                className="bg-sky-100 border-2 border-sky-800 text-xs text-sky-800 inline-flex justify-center p-1 rounded-md font-semibold">
                                                {collection.type}
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell py-5 pl-3 pr-4 text-left text-sm text-sky-800 sm:pr-0">
                                            <div
                                                className={`rounded-sm border-2 text-xs inline-flex justify-center p-2 sm:p-1 sm:rounded-md font-semibold ${getStatusStyles(collection.status).badge}`}>
                                                <span className="hidden sm:block">{collection.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 pl-3 pr-4 text-left text-sm sm:pr-0">
                                            <ChevronRightIcon
                                                className="h-6 mx-4 dark:text-gray-200 text-gray-800 transition-transform duration-300 group-hover:animate-bounce-x"/>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <TablePagination
                            currentPage={currentPage}
                            totalItems={Object.entries(collections).length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />

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