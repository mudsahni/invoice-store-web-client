"use client"

import * as React from "react"


interface CheckboxProps {
    title: string;
    id: string;
    selected: boolean;
    toggle: (id: string) => void;

}

const Checkbox: React.FC<CheckboxProps> = ({
                                               title,
                                               id,
                                               selected,
                                               toggle,
                                           }) => {
    return (
        <div className="group grid size-6 mr-2 grid-cols-1">
            <input
                aria-label={title}
                title={title}
                onClick={() => toggle(id)}
                checked={selected}  // Add this
                onChange={() => toggle(id)}  // Add this
                id={`file-${id}`}  // Add unique id
                name={`file-${id}`}
                type="checkbox"
                aria-describedby="file-selection"
                className={`${!selected && 'dark:group-hover:bg-gray-50 group-hover:bg-blue-900 group-hover:bg-opacity-20'} col-start-1 cursor-pointer row-start-1 appearance-none rounded dark:bg-gray-50 bg-blue-50 bg-opacity-[1%] border-[1px] dark:border-gray-50 border-blue-900 border-opacity-40 checked:border-green-700 checked:bg-green-700 dark:indeterminate:border-gray-50 dark:indeterminate:bg-gray-50 indeterminate:border-blue-700 indeterminate:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-50 disabled:border-gray-50 disabled:bg-gray-600 disabled:checked:bg-gray-600 forced-colors:appearance-auto`}

            />
            <svg
                fill="none"
                viewBox="0 0 14 14"
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-neutral-50 group-has-[:disabled]:stroke-neutral-50-950/25"
            >
                <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:checked]:opacity-100"
                />
                <path
                    d="M3 7H11"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                />
            </svg>
        </div>

    )
}
export {Checkbox}
