import React from 'react'
import {CollectionDocument} from "@/types/collections";
import {DocumentTextIcon, ChevronDownIcon} from '@heroicons/react/20/solid'
import {OptionsMenu} from "@/components/collection/OptionsMenu";
import {JsonView, allExpanded, defaultStyles, darkStyles} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import {StyleProps} from "react-json-view-lite/dist/DataRenderer";

export interface DocumentTableProps {
    documents: Record<string, CollectionDocument>
}

const customJsonViewStyles: StyleProps = {
    ...defaultStyles,  // Spread the default styles if you want to keep some
    container: 'bg-white rounded-xl',
    label: 'text-sky-800 mr-2',
    numberValue: 'text-red-700',
};

const DOCUMENT_TABLE_COLS = [
    "Name",
    "Type",
    "Last Update",
    "Status",
    ""
]

export const DocumentTable: React.FC<DocumentTableProps> = ({documents}) => {
    const [openRow, setOpenRow] = React.useState<string | null>(null);

    const toggleRow = (key: string) => {
        setOpenRow(openRow === key ? null : key);
    };

    return (
        <div className="px-8 pb-8 mx-auto max-w-7xl">

            <div className="bg-neutral-50 rounded-xl p-8">
                <div className="text-sky-900 sm:text-2xl/7 text-xl">
                    Documents
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-sky-800 divide-opacity-10">
                                <thead>
                                <tr>
                                    {
                                        DOCUMENT_TABLE_COLS.map((header, index) => (
                                            <th key={index}
                                                scope="col"
                                                className={`${index === 0 ? "pl-4 pr-3 sm:pl-0" : index === DOCUMENT_TABLE_COLS.length - 1 ? "relative pl-3 pr-4 sm:pr-0" : "px-3"} py-3.5 text-left text-sm font-semibold text-sky-800`}>
                                                {index === DOCUMENT_TABLE_COLS.length - 1 ?
                                                    <span className="sr-only">Options</span>
                                                    : header}
                                            </th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-800 divide-opacity-10">
                                {
                                    Object.entries(documents).map(([key, value], index) => (
                                        <React.Fragment key={key}>

                                            <tr key={key}
                                                className={`bg-neutral-100 bg-opacity-0 hover:bg-opacity-40 transition-colors ${openRow === key ? 'bg-opacity-40' : ''}`}>
                                                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                    <div className="flex items-center align-middle">
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => toggleRow(key)}
                                                        >
                                                            <div className="flex align-middle items-center">
                                                                <DocumentTextIcon className="h-4 mr-1 text-sky-700"/>
                                                                <div
                                                                    className="font-medium text-sky-700">{value.name}</div>
                                                                <ChevronDownIcon
                                                                    className={`h-4 ml-2 transition-transform duration-200 ${openRow === key ? 'rotate-180' : ''}`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="mt-1 text-sky-900 text-opacity-60">{`Id: ${value.id}`}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-theme-bg">
                                                    <span
                                                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                        {value.type}
                                                    </span>
                                                    {/*<div*/}
                                                    {/*    className="mt-1 text-gray-500">{person.department}</div>*/}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-sky-700">
                                                    {
                                                        value.updatedBy !== undefined ? (
                                                            <em className="">This document has never been
                                                                udpated.</em>
                                                        ) : (
                                                            <span>Crapbag</span>
                                                        )
                                                    }
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-theme-bg">
                                                    <span
                                                        className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        {value.status}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-base font-medium sm:pr-0">
                                                    <OptionsMenu menuName={value.name}/>
                                                </td>
                                            </tr>
                                            {/* Accordion Content Row */}
                                            <tr className={`${openRow === key ? '' : 'hidden'}`}>
                                                <td colSpan={5} className="px-4 sm:px-0">
                                                    <div className="py-5 border-t border-sky-800 border-opacity-10">
                                                        <div className="prose prose-sm max-w-none text-sky-900">
                                                            {/* Add your expanded content here */}
                                                            <h3 className="text-sky-800 text-sm font-semibold py-2">Raw
                                                                Output</h3>
                                                            <pre
                                                                className="bg-white rounded-xl p-4 rounded-lg overflow-auto">
                                                                {<JsonView data={JSON.parse(value.data.raw || "{}")}
                                                                           shouldExpandNode={allExpanded}
                                                                           style={customJsonViewStyles}/>}
                                                                {/*{JSON.stringify(value.data.raw, null, 2)}*/}
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
                    </div>
                </div>
            </div>
        </div>
    )
}