import React from "react";
import {LogoSection} from "@/components/ui/nav/LogoSection";
import {NavLink} from "@/components/ui/nav/NavLink";
import {NavigationSearchBar} from "@/components/ui/nav/NavigationSearchBar";
import {MobileMenuButton} from "@/components/ui/nav/MobileMenuButton";
import {NotificationButton} from "@/components/ui/nav/NotificationButton";
import {ProfileDropdown} from "@/components/ui/nav/Profile";
import {NavigationTypeProps} from "@/components/ui/nav/navigation";

export const WebNavigation: React.FC<NavigationTypeProps> = ({navigation, pathname, user}) => {
    return (
        <div className="mx-auto max-w-8xl dark:bg-gray-900 sm:px-8 px-2">
            <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <LogoSection/>
                    { /* Navigation Links */}
                    <div className="hidden lg:ml-6 lg:block">
                        <div className="flex space-x-4">
                            {navigation.map((item) =>
                                <NavLink key={item.name} mobile={false} pathname={pathname} item={item}/>
                            )}
                        </div>
                    </div>
                </div>
                <NavigationSearchBar/>
                <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <MobileMenuButton/>
                </div>
                <div className="hidden lg:ml-4 lg:block">
                    <div className="flex items-center">
                        <NotificationButton mobile={false}/>

                        {/* Profile dropdown */}
                        <ProfileDropdown mobile={false} user={user}/>
                    </div>
                </div>
            </div>
        </div>

    )
}
