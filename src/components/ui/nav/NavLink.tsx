import React from "react";
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


    const mobileHoverStyles = "text-neutral-900 hover:bg-neutral-100 transition-transform duration-100 tracking-wide opacity-80 hover:opacity-100"
    const mobileHighlightLogic = pathname === item.href ? `text-neutral-900 font-medium bg-neutral-100` : `font-medium ${mobileHoverStyles}`

    const hoverStyles = "text-neutral-900 transition-transform duration-100 tracking-wide hover:bg-neutral-100 opacity-80 hover:opacity-100"
    const highlightLogic = pathname === item.href ? `text-neutral-900 font-medium bg-neutral-100` : `font-medium ${hoverStyles}`

    return (
        mobile ? (
            <DisclosureButton
                key={item.href}
                as={Link}
                href={item.href}
                className={`block ${commonStyles} ${mobileHighlightLogic}`}
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
