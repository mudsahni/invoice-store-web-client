import React, {useState} from "react";
import {DisclosureButton, Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {useAuth} from "@/contexts/AuthContext";
import {UserData} from "@/types/auth";

interface ProfilePictureInformationProps {
    name: string | null
    email: string | null
}
export const ProfileInformation: React.FC<ProfilePictureInformationProps> = ({name, email}) => {
    return (
        <div className="ml-3">
            <div className="text-base font-medium text-white">{name}</div>
            <div className="text-sm font-medium text-gray-400">{email}</div>
        </div>

    )
}

export const ProfilePicture = () => {
    return (
        <div className="hover:scale-105 transition-transform duration-500">
            <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-8 rounded-full"
            />
        </div>

    )
}

interface ProfileMenuItemProps {
    mobile: boolean,
    name: string,
    href: string,
    onClick?: () => void
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({mobile, name, href, onClick}) => {
    return (
        mobile ? (
            <DisclosureButton
                as="a"
                href={href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                onClick={onClick}
            >
                {name}
            </DisclosureButton>

        ) : (
            <MenuItem>
                <a
                    href={href}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    onClick={onClick}
                >
                    {name}
                </a>
            </MenuItem>
        )

    )
}

interface ProfileDropDownProps {
    mobile: boolean,
    user: UserData | null,
}

export const ProfileDropdown: React.FC<ProfileDropDownProps> = ({mobile, user}) => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {signOut} = useAuth()

    // const handleSignOut = async () => {
    //     try {
    //         await signOut();
    //     } catch (error) {
    //         console.error('Error signing out:', error);
    //     }
    // };

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            setError('');

            await signOut()
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error("Unexpected error:", err);
        } finally {
            setIsLoading(false);
        }
    };


    const PROFILE_MENU_ITEMS = [
        {
            name: "Profile",
            href: "#"
        },
        {
            name: "Sign Out",
            href: "#",
            onClick: handleSignOut
        }
    ]
    return (

        mobile ? (
            <div className="mt-3 space-y-1 px-2">
                {PROFILE_MENU_ITEMS.map((item) =>
                    <ProfileMenuItem key={item.name} mobile={true} name={item.name} href={item.href} onClick={item.onClick} />
                )}
            </div>
        ) : (
            <Menu as="div" className="relative ml-4 shrink-0">
                <div>
                    <MenuButton
                        className="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5"/>
                        <span className="sr-only">Open user menu</span>
                        <ProfilePicture />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    {PROFILE_MENU_ITEMS.map((item) =>
                        <ProfileMenuItem key={item.name} mobile={false} name={item.name} href={item.href} onClick={item.onClick} />
                    )}
                </MenuItems>
            </Menu>
        )
    )
}
