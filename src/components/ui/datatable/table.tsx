import React from 'react'
import {StatusButton, StatusType} from "@/components/ui/status";
import {UserField} from "@/components/ui/datatable/userfield";


interface Data {
    [key: string]: any
}

interface TableHeaderFieldProps {
    index: number
    label: string
}

const TableHeaderField: React.FC<TableHeaderFieldProps> = ({index, label}) => {
    const commonStyles = "py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
    const conditionalStyles = index === 0 ? 'pl-4 pr-3 sm:pl-0' : 'px-3'
    return (
        <th
            scope="col"
            className={`${commonStyles} ${conditionalStyles}`}
        >
            {label}
        </th>
    )
}

interface TableHeaderProps {
    key: string
    label: string
}

interface TableHeadersProps {
    headers: TableHeaderProps[]
    columnsWithMetadataFields?: {[key: string]: string[]}
    combinedMetadataFields?: string[]
}

const TableHeader: React.FC<TableHeadersProps> = ({
                                                      headers,
                                                      columnsWithMetadataFields,
                                                      combinedMetadataFields
}) => {
    console.log(combinedMetadataFields)
   return (
       <thead>
       <tr>
           {
               headers.map((header, index) => {
                       if (combinedMetadataFields && combinedMetadataFields.includes(header.key)) {
                            return null
                       } else {
                           return <TableHeaderField key={header.key} index={index} label={header.label} />
                       }
                   }
               )}
           <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
               <span className="sr-only">Edit</span>
           </th>
       </tr>
       </thead>
   )
}

interface TableRowFieldProps {
    index: number
    children: React.ReactNode
}

const TableRowField: React.FC<TableRowFieldProps> = ({index, children}) => {
    const commonStyles =  "whitespace-nowrap py-4 text-sm font-medium justify-center text-gray-800"
    const conditionalStyles = index === 0 ? "sm:pl-2 pl-4 pr-3" : "px-3"
    return (
            <td className={`${commonStyles} ${conditionalStyles}`}>
                {children}
            </td>
    )
}

interface TableRowProps {
    data: Data
    statusColumn?: string
    statusColumnMapping?: {[key: string]: StatusType}
    userColumns?: string[]
    columnsWithMetadataFields?: {[key: string]: string[]}
    combinedMetadataFields?: string[]
}

const TableRow: React.FC<TableRowProps> = ({
                                               data,
                                               statusColumn,
                                               statusColumnMapping,
                                               userColumns,
                                               columnsWithMetadataFields,
                                               combinedMetadataFields
}) => {

    return (
        <tr key={data.invoiceNumber} className="hover:bg-slate-50 transition-transform duration-500">
            {Object.keys(data).map((key, index) => {

                if (combinedMetadataFields && combinedMetadataFields.includes(key)) {
                    return null;
                }

                if (userColumns && userColumns.includes(key)) {
                    return <TableRowField key={key} index={index}>
                        <UserField email={"muditsahni@msn.com"} name={data[key]} />
                        {
                            columnsWithMetadataFields && key in columnsWithMetadataFields && columnsWithMetadataFields[key].map(field => {
                                    return (
                                        <div className="flex" key={field}>
                                            <div
                                                className="text-sm font-medium text-gray-400">{`${field}:`}</div>
                                            <div
                                                className="text-sm font-medium text-gray-400 ml-2">{data[field]}</div>
                                        </div>
                                    )
                                }

                            )
                        }
                    </TableRowField>
                }
                if (columnsWithMetadataFields && key in columnsWithMetadataFields) {
                    return <TableRowField key={key} index={index}>
                        <div className="items-center">
                            <div className="text-sm font-medium text-gray-800">{data[key]}</div>
                            {
                                columnsWithMetadataFields[key].map(field => {
                                   return (
                                       <div className="flex" key={field}>
                                           <div
                                               className="text-sm font-medium text-gray-400">{`${field}:`}</div>
                                           <div
                                               className="text-sm font-medium text-gray-400 ml-2">{data[field]}</div>


                                       </div>

                                   )
                               })
                            }
                        </div>
                    </TableRowField>
                }

                if (statusColumn === key && statusColumnMapping) {
                    return <TableRowField key={key} index={index}>
                        <StatusButton type={statusColumnMapping[data[key]]} label={data[key]}/>
                    </TableRowField>
                }

                    return <TableRowField key={key} index={index}>{data[key]}</TableRowField>
                }
            )}
            <td className="sm:pr-2 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit
                </a>
            </td>
        </tr>

    )
}

interface TableProps {
    headers: TableHeaderProps[]
    dataset: Data[]
    statusColumn?: string
    statusColumnMapping?: {[key: string]: StatusType}
    userColumns?: string[]
    columnsWithMetadataFields?: {[key: string]: string[]}
}

// Function to filter each row of data based on the headers
function filterDataByHeaders(data: Data[], headers: TableHeaderProps[]): Data[] {
    // Get an array of valid keys from the headers
    const validKeys = new Set(headers.map(header => header.key));
    // Filter each row in the data
    return data.map(row => {
        const filteredRow: Data = {};
        headers.forEach(header => {
            if (row.hasOwnProperty(header.key)) {
                filteredRow[header.key] = row[header.key];
            }
        } )
        return filteredRow;
    });
}

export const Table: React.FC<TableProps> = ({
                                                headers,
                                                dataset,
                                                statusColumn,
                                                statusColumnMapping,
                                                userColumns,
                                                columnsWithMetadataFields
}) => {
    // reduce dataset to only fields which are a part of headers
    const filteredDataset = filterDataByHeaders(dataset, headers);

    let combinedList: string[] = []
    if (columnsWithMetadataFields) {
        combinedList = Object.values(columnsWithMetadataFields).flat();
    }


    return (
        <div className="bg-white">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <TableHeader
                                headers={headers}
                                columnsWithMetadataFields={columnsWithMetadataFields}
                                combinedMetadataFields={combinedList}
                            />
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredDataset.map((data, index) => (
                               <TableRow
                                   key={index}
                                   data={data}
                                   statusColumn={statusColumn}
                                   statusColumnMapping={statusColumnMapping}
                                   userColumns={userColumns}
                                   columnsWithMetadataFields={columnsWithMetadataFields}
                                   combinedMetadataFields={combinedList}
                               />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
