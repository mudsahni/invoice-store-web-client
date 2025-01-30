import { CheckIcon } from '@heroicons/react/20/solid'
import React from 'react'

const classNames = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ')
}

export interface Step {
    name: string;
    description: string;
    href: string;
    status: 'complete' | 'current' | 'upcoming';
}
interface StepsProps {
    steps: Step[]
}

export const Steps: React.FC<StepsProps> = ({steps}) => {
    return (
        <nav aria-label="Progress" className="mb-8 sm:pb-0 sm:py-4">
            <ol role="list" className="overflow-hidden md:flex md:px-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={classNames(
                        stepIdx !== steps.length - 1 ? 'pb-10 md:pb-0' : '',
                        'relative flex-1'
                    )}>
                        {step.status === 'complete' ? (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-theme-bg",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <div className="group relative flex items-start">
                                    <span className="flex h-9 items-center">
                                        <span className="border-2 relative z-10 flex size-9 items-center justify-center rounded-full bg-secondary-600">
                                            <CheckIcon aria-hidden="true" className="size-5 text-theme-bg" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm text-theme-bg font-semibold">{step.name}</span>
                                        <span className="text-sm text-theme-bg text-opacity-80 pt-1">{step.description}</span>
                                    </span>
                                </div>
                            </>
                        ) : step.status === 'current' ? (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-theme-bg",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <div aria-current="step" className="group relative flex items-start">
                                    <span aria-hidden="true" className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-primary-500">
                                            <span className="size-2.5 rounded-full bg-theme-bg" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-semibold text-theme-bg">{step.name}</span>
                                        <span className="text-sm text-theme-bg text-opacity-80">{step.description}</span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                {stepIdx !== steps.length - 1 ? (
                                    <div aria-hidden="true" className={classNames(
                                        "absolute left-4 top-4 -ml-px mt-0.5 w-0.5 bg-theme-bg ",
                                        "h-full md:h-0.5 md:w-full md:left-0 md:top-4 md:ml-0"
                                    )} />
                                ) : null}
                                <div className="group relative flex items-start">
                                    <span aria-hidden="true" className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center
                                        rounded-full border-2 border-theme-bg border-opacity-60 bg-theme-bg">
                                            <span className="size-2.5 rounded-full bg-theme-bg bg-opacity-0" />
                                        </span>
                                    </span>
                                    <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-semibold text-theme-bg">{step.name}</span>
                                        <span className="text-sm text-theme-bg">{step.description}</span>
                                    </span>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}