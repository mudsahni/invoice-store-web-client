import React from 'react'
import {CollectionDocument, DocumentStatus} from "@/types/collections";
import {ChevronDownIcon, DocumentTextIcon,} from '@heroicons/react/20/solid'
import {OptionsMenu} from "@/components/collection/OptionsMenu";
import {allExpanded, defaultStyles, JsonView} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import {StyleProps} from "react-json-view-lite/dist/DataRenderer";
import {ErrorDisplay, getOptionsMenu} from "@/components/collection/utils";
import {documentService} from "@/services/documentService";
import {CacheManager} from "@/services/cacheManager";
import {SheetIcon} from "lucide-react";
import TablePagination from "@/components/ui/Pagination";
import {collectionsService} from "@/services/collectionService";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {getStatusStyles} from "@/components/collections/utils";

export interface DocumentTableProps {
    collectionId: string;
    documents: Record<string, CollectionDocument>
}

interface SafeJsonViewProps {
    rawData: any;
    allExpanded?: boolean;
    customJsonViewStyles?: Record<string, any>;
}

interface DocumentData {
    data: {
        raw: string | Record<string, any> | null;
    };
    // Add other properties your document data has
}

const SafeJsonView: React.FC<SafeJsonViewProps> = ({
                                                       rawData,
                                                       customJsonViewStyles = {}
                                                   }) => {

    try {
        // First try to parse if it's a string
        const parsedData = typeof rawData === 'string'
            ? JSON.parse(rawData)
            : rawData;

        return (
            <JsonView
                data={parsedData}
                shouldExpandNode={() => true}
                style={customJsonViewStyles}
            />
        );
    } catch (error) {
        // console.error('JSON Parse Error:', error);

        return (
            <>
                <div className="text-red-500 mb-2 p-2 bg-red-50 rounded">
                    Error parsing JSON data
                </div>
                <div className="whitespace-pre-wrap font-mono text-sm">
                    {typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2)}
                </div>
            </>
        );
    }
};

const customJsonViewStyles: StyleProps = {
    ...defaultStyles,  // Spread the default styles if you want to keep some
    container: 'bg-white rounded-xl',
    label: 'text-gray-800 mr-2',
    numberValue: 'text-red-700',
};

const DOCUMENT_TABLE_COLS = [
    "Name",
    "Type",
    "Last Update",
    "Status",
    "Errors",
    ""
]

const documentDownloadLinkCache = new CacheManager<string>({
    prefix: 'documentDownloadLink',
    ttl: 50 * 60 * 1000, // 50 minutes
})

export const DocumentTable: React.FC<DocumentTableProps> = ({collectionId, documents}) => {
    const [openRow, setOpenRow] = React.useState<string | null>(null);
    const [documentDownloadLinks, setDocumentDownloadLinks] = React.useState<Record<string, string>>({});
    const [optionsMenuItems, setOptionsMenuItems] = React.useState<Record<string, ReturnType<typeof getOptionsMenu>>>({});
    const [exporting, setExporting] = React.useState<boolean>(false);

    const toggleRow = (key: string) => {
        setOpenRow(openRow === key ? null : key);
    };

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const itemsPerPage = 10;
    // Calculate the indexes for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Create a function to get current page data
    const getCurrentPageData = () => {
        return Object.entries(documents)
            .slice(startIndex, endIndex);
    };


    // Get the current page documents
    const currentDocuments = getCurrentPageData();

    React.useEffect(() => {
        // first check cache for download links
        // if the links are present then set them in the state
        // if the cache doesnt have the links for the document ids here
        // then fetch the links and save them in the cache and set them in the state

        const documentIds = Object.keys(documents);
        // create a map of document ids to download links by going through the documentIds and fetching each link one by one
        const cachedLinks = documentIds.reduce((acc, id) => {
            const cachedLink = documentDownloadLinkCache.get(id);
            if (cachedLink) {
                acc[id] = cachedLink.data;
            }
            return acc;
        }, {} as Record<string, string>);

        // get the missing document ids
        const missingDocumentIds = documentIds.filter((id) => !cachedLinks[id]);

        if (missingDocumentIds.length > 0) {
            missingDocumentIds.forEach((id) => {
                documentService.getDocumentDownloadLink(id)
                    .then((link) => {
                        documentDownloadLinkCache.set(id, link.downloadUrl);
                        setDocumentDownloadLinks((prev) => ({
                            ...prev,
                            [id]: link.downloadUrl
                        }));
                    })
                    .catch((err) => {
                        console.error('Error fetching download link for document:', err);
                    })
            })
        } else {
            setDocumentDownloadLinks(cachedLinks);
        }

    }, [documents])

    React.useEffect(() => {
        const loadedOptionsMenuItems = Object.entries(documents).reduce((acc, [key, value]) => {
            console.log(`Document download link: ${documentDownloadLinks[key]}`)
            acc[key] = getOptionsMenu(value.collectionId, value.id, documentDownloadLinks[key]);
            return acc;
        }, {} as Record<string, ReturnType<typeof getOptionsMenu>>);
        setOptionsMenuItems(loadedOptionsMenuItems);
    }, [documentDownloadLinks, documents])

    const exportCSV = async () => {
        try {
            setExporting(true)
            const blob = await collectionsService.exportCollection(collectionId);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `collection_${collectionId}.csv`;  // or any filename you want
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export failed:', error);
            // Handle error (show notification, etc.)
        } finally {
            setExporting(false);
        }
    }
    return (

        <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex justify-between align-middle items-center">
                <span className="text-gray-700 font-bold sm:text-4xl text-3xl">Documents</span>
                <button
                    disabled={exporting}
                    className={`${exporting ? 'bg-gray-100 border-gray-400 text-gray-400' : 'bg-sky-100 border-sky-800 text-sky-800'} flex align-middle space-x-2 items-center py-1 px-2  rounded-md border font-semibold text-sm`}
                    onClick={exportCSV}>
                    {
                        exporting ? <LoadingSpinner size={4} className={"mr-2"}/> : <SheetIcon className="h-4"/>
                    }
                    Export
                </button>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-800 divide-opacity-10">
                            <thead>
                            <tr>
                                {
                                    DOCUMENT_TABLE_COLS.map((header, index) => (
                                        <th key={index}
                                            scope="col"
                                            className={`${index === 0 ? "pl-4 pr-3 sm:pl-0" : index === DOCUMENT_TABLE_COLS.length - 1 ? "relative pl-3 pr-4 sm:pr-0" : "px-3"} ${index === 0 || index === DOCUMENT_TABLE_COLS.length - 1 ? "table-cell" : "sm:table-cell hidden"} py-3.5 text-left text-sm font-semibold text-gray-800`}>
                                            {index === DOCUMENT_TABLE_COLS.length - 1 ?
                                                <span className="sr-only">Options</span>
                                                : header}
                                        </th>
                                    ))
                                }
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 divide-opacity-10">
                            {
                                currentDocuments.map(([key, value], index) => (
                                    <React.Fragment key={key}>

                                        <tr key={key}
                                            className={`bg-neutral-100 bg-opacity-0 hover:bg-opacity-40 transition-colors ${openRow === key ? 'bg-opacity-40' : ''}`}>
                                            <td className={`whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0 sm:max-w-full max-w-xs sm:border-0 border-l-2 ${getStatusStyles(value.status).border}`}>
                                                <div className="flex items-center align-middle">
                                                    <div
                                                        className="cursor-pointer w-full overflow-hidden truncate"
                                                        onClick={() => toggleRow(key)}
                                                    >
                                                        <div className="flex align-middle items-center">
                                                            <DocumentTextIcon className="h-4 mr-1 text-gray-700"/>
                                                            <div
                                                                className="font-medium text-gray-700 truncate overflow-hidden">{value.name}</div>
                                                            <ChevronDownIcon
                                                                className={`h-4 ml-2 transition-transform duration-200 ${openRow === key ? 'rotate-180' : ''}`}
                                                            />
                                                        </div>
                                                        <div
                                                            className="mt-1 text-gray-500 truncate overflow-hidden">{`Id: ${value.id}`}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="sm:table-cell hidden whitespace-nowrap px-3 py-5 text-sm">
                                                    <span
                                                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                        {value.type}
                                                    </span>
                                                {/*<div*/}
                                                {/*    className="mt-1 text-gray-500">{person.department}</div>*/}
                                            </td>
                                            <td className="sm:table-cell hidden whitespace-nowrap px-3 py-5 text-sm text-gray-700">
                                                {
                                                    value.updatedBy !== undefined ? (
                                                        <em className="">This document has never been
                                                            updated.</em>
                                                    ) : (
                                                        <span>{value.updatedBy}</span>
                                                    )
                                                }
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm sm:table-cell hidden">
                                                    <span
                                                        className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        {value.status}
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm sm:table-cell hidden">
                                                <ErrorDisplay errors={value.data.errors || {}}/>
                                            </td>
                                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-base font-medium sm:pr-0">
                                                {
                                                    value.status === DocumentStatus.VALIDATED &&
                                                    <OptionsMenu menuItems={optionsMenuItems[key]}
                                                                 menuName={value.name}/>
                                                }
                                            </td>
                                        </tr>
                                        {/* Accordion Content Row */}
                                        <tr className={`${openRow === key ? '' : 'hidden'}`}>
                                            <td colSpan={5} className="px-4 sm:px-0">
                                                <div className="py-5 border-t border-gray-800 border-opacity-10">
                                                    <div className="prose prose-sm max-w-none text-gray-800">
                                                        {/* Add your expanded content here */}
                                                        <h3 className="text-gray-800 text-sm font-semibold py-2">Raw
                                                            Output</h3>
                                                        <pre className="bg-white rounded-xl p-4 overflow-auto">
                                                            <SafeJsonView
                                                                rawData={value?.data?.raw ?? {}}
                                                                customJsonViewStyles={{
                                                                    // Your custom styles
                                                                }}
                                                            />
                                                        </pre>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination UI */}
                    <div className="sm:px-8">
                        <TablePagination
                            currentPage={currentPage}
                            totalItems={Object.entries(documents).length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />

                    </div>

                </div>
            </div>
        </div>
    )
}