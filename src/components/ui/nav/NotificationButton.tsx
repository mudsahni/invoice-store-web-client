import React from "react";
import {BellIcon} from "@heroicons/react/24/outline";

interface NotificationButtonProps {
    mobile: boolean
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ mobile }) => {
    const mobileButtonClasses = "relative ml-auto shrink-0 rounded-full bg-theme-text p-1 " +
        "text-theme-bg hover:text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-bg focus:ring-offset-2 " +
        "focus:ring-offset-theme-bg hover:bg-theme-bg border-[1px] hover:border-theme-bg"
    const webButtonClasses = "relative shrink-0 rounded-full bg-theme-bg border-2 border-theme-text p-1 text-theme-text hover:text-theme-bg hover:bg-theme-text " +
        "focus:outline-none focus:ring-2 focus:ring-theme-bg focus:ring-offset-2 focus:ring-offset-theme-bg"
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
