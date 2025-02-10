import {Disclosure} from '@headlessui/react'
import {usePathname} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";
import React from "react";
import {WebNavigation} from "@/components/ui/nav/WebNavigation";
import {MobileNavigation} from "@/components/ui/nav/MobileNavigation";
import {NAVIGATION_ITEMS} from "@/components/ui/nav/navigationItems";

const Navigation = () => {

    const pathname: string = usePathname();
    const {authUser} = useAuth();

    // Function to check if link is active
    // const isActive = (path: string) => pathname === path;

    return (
        <Disclosure as="nav" className="border-b pb-4">
            <>
                <WebNavigation navigation={NAVIGATION_ITEMS} pathname={pathname} user={authUser}/>
                <MobileNavigation navigation={NAVIGATION_ITEMS} pathname={pathname} user={authUser}/>
            </>
        </Disclosure>
    )

}

export default Navigation