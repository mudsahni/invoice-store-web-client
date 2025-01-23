import React from "react";
import {BellIcon} from "@heroicons/react/24/outline";

interface NotificationButtonProps {
    mobile: boolean
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ mobile }) => {
    const mobileButtonClasses = "relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 " +
        "text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 " +
        "focus:ring-offset-gray-800"
    const webButtonClasses = "relative shrink-0 rounded-full bg-stone-200 p-1 text-neutral-800 hover:text-white " +
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    const buttonClasses = mobile ?  mobileButtonClasses : webButtonClasses

    return (
        <button
            type="button"
            className={buttonClasses}
        >
            <span className="absolute -inset-1.5"/>
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6"/>
        </button>
    )
}
