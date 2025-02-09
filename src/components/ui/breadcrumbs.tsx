import {HomeIcon, ChevronRightIcon} from '@heroicons/react/20/solid'

const pages = [
    {name: 'Projects', href: '#', current: false},
    {name: 'Project Nero', href: '#', current: true},
]

interface BreadcrumbsProps {
    pages: { name: string, href: string, current: boolean }[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({pages}) => {
    return (
        <nav aria-label="Breadcrumb"
             className="flex dark:bg-gray-900 dark:px-8 rounded-xl align-middle items-center">
            <ol role="list" className="flex items-center space-x-2 align-middle py-4">
                <li>
                    <div>
                        <a href="#" className="dark:text-gray-200 text-gray-800 opacity-80 hover:opacity-100">
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0"/>
                            <span className="sr-only">Home</span>
                        </a>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="h-4 dark:text-gray-200 text-gray-800"/>
                            <a
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className={`${page.current && "pointer-events-none cursor-not-allowed"} font-medium ml-2 text-sm dark:text-gray-200 text-gray-800 opacity-80 hover:opacity-100`}
                            >
                                {page.name}
                            </a>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
