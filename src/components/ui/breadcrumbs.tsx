import {ChevronRightIcon, HomeIcon} from '@heroicons/react/20/solid'
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

// utils/breadcrumbs.ts
const routeNameMap: Record<string, string> = {
    'collections': 'Collections',
    'documents': 'Documents',
    'settings': 'Settings',
    // Add more mappings as needed
};

export function generateBreadcrumbs(path: string) {
    const parts = path.split('/').filter(part => part);
    return parts.map((part, index) => {
        const href = `/${parts.slice(0, index + 1).join('/')}`;

        // Check if it's a dynamic route (e.g., [id])
        if (part.match(/^[0-9a-fA-F-]+$/)) {
            // This is likely an ID, use the previous part's name
            const contextPart = parts[index - 1];
            const singularName = contextPart?.slice(0, -1) || 'Item';
            return {
                name: part,
                href,
                current: index === parts.length - 1
            };
        }

        // Use mapped name or generate from path
        const name = routeNameMap[part] || part.charAt(0).toUpperCase() + part.slice(1);

        return {
            name: name.replace(/-/g, ' '),
            href,
            current: index === parts.length - 1
        };
    });
}

const pages = [
    {name: 'Projects', href: '#', current: false},
    {name: 'Project Nero', href: '#', current: true},
]

interface BreadcrumbsProps {
    pages: { name: string, href: string, current: boolean }[]
}

export const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    return (
        <nav aria-label="Breadcrumb"
             className="flex dark:bg-gray-900 dark:px-8 rounded-xl align-middle items-center">
            <ol role="list" className="flex items-center space-x-2 align-middle py-4">
                <li>
                    <div>
                        <Link href="/"
                              className="dark:text-gray-200 text-gray-800 opacity-80 hover:opacity-100">
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0"/>
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {breadcrumbs.map((page) => (
                    <li key={page.href}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="h-4 dark:text-gray-200 text-gray-800"/>
                            <Link
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className={`
                                    ${page.current ? 'pointer-events-none cursor-not-allowed text-opacity-80' : ''}
                                    font-medium ml-2 hover:underline text-sm dark:text-gray-200 text-gray-800 opacity-80 hover:opacity-100
                                `}
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};