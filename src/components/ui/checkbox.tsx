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
            className={`${!selected && 'group-hover:bg-theme-text group-hover:bg-opacity-20'} col-start-1 cursor-pointer row-start-1 appearance-none rounded bg-theme-text bg-opacity-[1%] border-[2px] border-theme-text border-opacity-40 checked:border-secondary-600 checked:bg-secondary-600 indeterminate:border-theme-text indeterminate:bg-theme-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-text disabled:border-theme-text disabled:bg-theme-text disabled:checked:bg-theme-text forced-colors:appearance-auto`}

        />
        <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-theme-text-950/25"
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
