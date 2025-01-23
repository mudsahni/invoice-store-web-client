import {SEARCH_BACKGROUND_COLOR, TEXT_COLOR} from "@/components/ui/nav/colors";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import React from "react";

export const NavigationSearchBar = () => {
    return (
        <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className={`col-start-1 row-start-1 block w-full rounded-md ${SEARCH_BACKGROUND_COLOR} py-1.5 pl-10 pr-3 text-base ${TEXT_COLOR} outline-none placeholder:${TEXT_COLOR} focus:bg-stone-50 focus:text-stone-900 focus:placeholder:text-stone-900 sm:text-sm/6`}
                />
                <MagnifyingGlassIcon
                    aria-hidden="true"
                    className={`pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center ${TEXT_COLOR}`}
                />
            </div>
        </div>

    )
}
