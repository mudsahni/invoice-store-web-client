import React from 'react'
import {parse, format, isValid} from 'date-fns';
import {ExclamationCircleIcon} from "@heroicons/react/16/solid";
import {ErrorSeverity} from "@/types/collections";


interface DocumentFieldProps {
    label: string,
    type: string,
    path: string,
    handleOnChange: (path: string, value: string) => void,
    disabled: boolean,
    value?: string | number,
    error?: string,
    severity?: ErrorSeverity
}

const parseDate = (dateString: string) => {
    // Array of possible date formats to try
    const dateFormats = [
        'dd-MM-yyyy',
        'dd/MM/yyyy',
        'dd-MMM-yyyy',
        'yyyy-MM-dd',
        // Add more formats as needed
    ];

    for (const dateFormat of dateFormats) {
        const parsedDate = parse(dateString, dateFormat, new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
    }
    return null;
};


export const DocumentField: React.FC<DocumentFieldProps> = ({
                                                                label,
                                                                type,
                                                                path,
                                                                handleOnChange,
                                                                disabled,
                                                                value,
                                                                error,
                                                                severity = ErrorSeverity.MINOR
                                                            }) => {


    const handleDateChange = (dateString: string) => {
        const parsedDate = parseDate(dateString);
        if (parsedDate) {
            // Convert to yyyy-MM-dd format for consistency
            const formattedDate = format(parsedDate, 'yyyy-MM-dd');
            handleOnChange(path, formattedDate);
        } else {
            // Handle invalid date
            handleOnChange(path, dateString);
        }
    };

    let displayValue = value

    if (type === 'date') {
        // When displaying the date, ensure it's in yyyy-MM-dd format for the input
        if (typeof value === 'string') {
            displayValue = value ? (() => {
                const parsedDate = parseDate(value);
                return parsedDate ? format(parsedDate, 'yyyy-MM-dd') : value;
            })() : '';
        }
    }

    return (
        <div>
            {
                type === 'textarea' ? (
                    <>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <textarea
                            disabled={disabled}
                            value={displayValue}
                            onChange={(e) => handleOnChange(path, e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            rows={3}
                        />
                    </>

                ) : (
                    <>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <input
                            disabled={disabled}
                            type={type}
                            value={displayValue}
                            onChange={(e) => handleOnChange(path, e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                        />
                    </>
                )
            }
            {
                error &&
                <div
                    className={`${severity !== ErrorSeverity.MINOR ? "bg-red-50 text-red-800 border-red-800" : "bg-yellow-50 text-yellow-800 border-yellow-800"} flex rounded-md align-middle items-center space-x-4 justify-start border text-sm py-1 px-2 my-2`}>
                    <ExclamationCircleIcon className="h-5"/>
                    <span>{error}</span>
                </div>
            }
        </div>
    )
}