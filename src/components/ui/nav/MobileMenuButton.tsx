import {DisclosureButton} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";

export const MobileMenuButton = () => {
    return (
        <DisclosureButton
            className="group relative inline-flex items-center justify-center rounded-md p-2 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-800">
            <span className="absolute -inset-0.5"/>
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden"/>
            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block"/>
        </DisclosureButton>
    )
}
