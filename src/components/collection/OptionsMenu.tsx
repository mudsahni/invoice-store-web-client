import React from 'react'
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ArrowDownTrayIcon, ArchiveBoxXMarkIcon, PencilSquareIcon, ArrowPathIcon} from "@heroicons/react/20/solid";
import WaveEllipsisButton from "@/components/ui/WaveEllipsisButton";

const MENU_ITEM_BOX_CLASSES = "px-4 py-2 flex align-middle items-center data-[focus]:bg-sky-100 data-[focus]:text-sky-700 data-[focus]:outline-none"
const MENU_ITEM_CLASSES = "text-sm text-sky-700"

const DEFAULT_OPTIONS_MENU_ITEMS = [
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <PencilSquareIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
      Review and Edit
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <ArrowDownTrayIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
       Download File
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <ArchiveBoxXMarkIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
      Delete Document
    </span>
    </a>,
    <a
        className={MENU_ITEM_BOX_CLASSES}
        href="#"
    >
        <ArrowPathIcon className="h-4 mr-2 text-sky-700"/>
        <span className={MENU_ITEM_CLASSES}>
     Refresh
    </span>
    </a>,


]

interface OptionsMenuProps {
    menuItems?: React.ReactNode[];
    menuName: string;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({menuItems, menuName}) => {
    const menuItemsToRender = menuItems || DEFAULT_OPTIONS_MENU_ITEMS;
    React.useEffect(() => {
        const updateMenuPosition = (event: Event) => {
            const button = event.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            document.documentElement.style.setProperty(
                '--menu-position-right',
                `${window.innerWidth - rect.right}px`
            );
            document.documentElement.style.setProperty(
                '--menu-position-top',
                `${rect.bottom + window.scrollY}px`
            );
        };

        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach(button => {
            button.addEventListener('click', updateMenuPosition as EventListener);
        });

        return () => {
            buttons.forEach(button => {
                button.removeEventListener('click', updateMenuPosition as EventListener);
            });
        };
    }, []);

    return <Menu as="div" className="relative inline-block text-left">
        <div>
            <MenuButton
                className="menu-button flex items-center rounded-full bg-sky-50 hover:bg-sky-100 p-1 text-sky-400 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-100">
                <WaveEllipsisButton name={menuName}/>
            </MenuButton>
        </div>

        <MenuItems
            transition
            className="fixed right-30 bottom-10 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            style={{
                // position: 'fixed',
                // right: 'var(--menu-position-right, 16px)',
                // top: 'var(--menu-position-top, 16px)'
            }}
        >
            <div className="py-1">
                {
                    menuItemsToRender.map((menuItem, index) => (
                        <MenuItem key={index}>
                            {menuItem}
                        </MenuItem>
                    ))
                }
            </div>
        </MenuItems>
    </Menu>
}