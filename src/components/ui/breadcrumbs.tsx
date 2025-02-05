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
        <nav aria-label="Breadcrumb" className="flex bg-yellow-50 rounded-xl px-8 align-middle items-center">
            <ol role="list" className="flex items-center space-x-2 align-middle py-8">
                <li>
                    <div>
                        <a href="#" className="text-yellow-800 opacity-80 hover:opacity-100">
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0"/>
                            <span className="sr-only">Home</span>
                        </a>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="h-4 text-yellow-800"/>
                            <a
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className={`${page.current && "pointer-events-none cursor-not-allowed"} font-medium ml-2 text-sm text-yellow-800 opacity-80 hover:opacity-100`}
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
