import { CheckIcon } from '@heroicons/react/20/solid'

const steps = [
    { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', href: '#', status: 'complete' },
    {
        name: 'Profile information',
        description: 'Cursus semper viverra facilisis et et some more.',
        href: '#',
        status: 'current',
    },
    { name: 'Business information', description: 'Penatibus eu quis ante.', href: '#', status: 'upcoming' },
    { name: 'Theme', description: 'Faucibus nec enim leo et.', href: '#', status: 'upcoming' },
    { name: 'Preview', description: 'Iusto et officia maiores porro ad non quas.', href: '#', status: 'upcoming' },
]

const classNames = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ')
}

export default function Steps() {
    return (
        <nav aria-label="Progress" className="mb-8 sm:pb-0 sm:py-4">
            <ol role="list" className="overflow-hidden md:flex md:space-x-16 md:px-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={classNames(
                        stepIdx !== steps.length - 1 ? 'pb-10 md:pb-0' : '',
                        'relative flex-1'
                    )}>
                        {step.status === 'complete' ? (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-green-600",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <a href={step.href} className="group relative flex items-start">
                                    <span className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                                            <CheckIcon aria-hidden="true" className="size-5 text-white" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium">{step.name}</span>
                                        <span className="text-sm text-white">{step.description}</span>
                                    </span>
                                </a>
                            </>
                        ) : step.status === 'current' ? (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-gray-300",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <a href={step.href} aria-current="step" className="group relative flex items-start">
                                    <span aria-hidden="true" className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                                            <span className="size-2.5 rounded-full bg-indigo-600" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium text-white">{step.name}</span>
                                        <span className="text-sm text-gray-400">{step.description}</span>
                                    </span>
                                </a>
                            </>
                        ) : (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-gray-300",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <a href={step.href} className="group relative flex items-start">
                                    <span aria-hidden="true" className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                                            <span className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium text-gray-500">{step.name}</span>
                                        <span className="text-sm text-gray-500">{step.description}</span>
                                    </span>
                                </a>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}