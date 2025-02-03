import React from "react";
import {BellIcon} from "@heroicons/react/24/outline";

interface NotificationButtonProps {
    mobile: boolean
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({mobile}) => {
    const mobileButtonClasses = "relative ml-auto shrink-0 rounded-full bg-neutral-50 p-1 " +
        "text-neutral-800 hover:text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-1 " +
        "focus:ring-offset-neutral-900 hover:bg-neutral-100"
    const webButtonClasses = "relative shrink-0 rounded-full bg-neutral-50 p-1 text-neutral-800 hover:text-neutral-900 hover:bg-neutral-100 " +
        "focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-1 focus:ring-offset-neutral-900"
    const buttonClasses = mobile ? mobileButtonClasses : webButtonClasses

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
