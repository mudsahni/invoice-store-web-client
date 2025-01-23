import React from "react";
import {
    HIGHLIGHTED_BACKGROUND_COLOR,
    HIGHLIGHTED_TEXT_COLOR,
    HOVER_BACKGROUND_COLOR,
    TEXT_COLOR
} from "@/components/ui/nav/colors";
import {DisclosureButton} from "@headlessui/react";
import Link from "next/link";

interface NavLinkProps {
    mobile: boolean,
    pathname: string;
    item: { name: string, href: string }

}


export const NavLink: React.FC<NavLinkProps> = ({mobile, pathname, item}) => {

    const commonStyles = `rounded-md px-3 py-2 text-base`
    // const highlightLogic = pathname === item.href
    //     ? `${HIGHLIGHTED_BACKGROUND_COLOR} ${HIGHLIGHTED_TEXT_COLOR}`
    //     : `${TEXT_COLOR} hover:${HOVER_BACKGROUND_COLOR} hover:${HIGHLIGHTED_TEXT_COLOR}`

    const hoverStyles = "dark:hover:text-gray-300 transition-transform duration-100 dark:text-white hover:text-blue-600 tracking-wide"
    const highlightLogic = pathname === item.href ? `dark:text-white font-semibold` : `font-medium ${hoverStyles}`

    return (
        mobile ? (
            <DisclosureButton
                key={item.href}
                as={Link}
                href={item.href}
                className={`block ${commonStyles} ${highlightLogic}`}
            >
                {item.name}
            </DisclosureButton>
        ) : (
            <Link
                key={item.href}
                href={item.href}
                className={`${commonStyles} ${highlightLogic}`}
            >
                {item.name}
            </Link>

        )
    )
}
