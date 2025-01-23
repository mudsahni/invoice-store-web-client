import React from "react";
import {DisclosurePanel} from "@headlessui/react";
import {NavLink} from "@/components/ui/nav/NavLink";
import {ProfileDropdown, ProfileInformation, ProfilePicture} from "@/components/ui/nav/Profile";
import {NotificationButton} from "@/components/ui/nav/NotificationButton";
import {NavigationTypeProps} from "@/components/ui/nav/navigation";

export const MobileNavigation: React.FC<NavigationTypeProps> = ({navigation, pathname, user}) => {
    return (
        <DisclosurePanel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) =>
                    <NavLink key={item.name} mobile={true} pathname={pathname} item={item}/>
                )}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                    <div className="shrink-0">
                        <ProfilePicture />
                    </div>
                    <ProfileInformation name={user?.firstName + " " + user?.lastName || ''} email={user?.email || ''} />

                    <NotificationButton mobile={true} />

                </div>
                <ProfileDropdown mobile={true} user={user} />
            </div>
        </DisclosurePanel>
    )
}
