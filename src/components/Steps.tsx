import React from 'react'
import {CheckIcon} from "lucide-react";

export enum StepStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR'
}

interface Step {
    id: string;
    name: string;
    status: StepStatus
}

interface StepsProps {
    steps: Step[]
}

export const Steps: React.FC<StepsProps> = ({steps}) => {

    return (
        <nav aria-label="Progress">
            <ol role="list"
                className="dark:bg-gray-200 bg-blue-50 divide-y dark:divide-gray-800 divide-blue-400 rounded-md border dark:border-gray-200 border-blue-400 md:flex md:divide-y-0 mb-8">
                {
                    steps.map((step, stepIdx) =>
                            <li key={step.name} className="relative md:flex md:flex-1">
                                {step.status === StepStatus.COMPLETED ? (
                                    <div className="  group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-800">
                    <CheckIcon aria-hidden="true" className="size-6 dark:text-gray-200 text-blue-50"/>
                  </span>
                  <span className="ml-4 text-sm font-medium dark:text-gray-800 text-blue-800">{step.name}</span>
                </span>
                                    </div>
                                ) : step.status === StepStatus.IN_PROGRESS ? (
                                    <div aria-current="step"
                                         className="flex items-center px-6 py-4 text-sm font-medium">
                <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 border-2 border-blue-600">
                  <span className="dark:text-gray-200 text-blue-50">{step.id}</span>
                </span>
                                        <span
                                            className="ml-4 text-sm font-medium dark:text-gray-800 text-blue-800">{step.name}</span>
                                    </div>
                                ) : (
                                    <div className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 dark:border-gray-800 border-blue-800">
                    <span className="dark:text-gray-800 text-blue-800">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-blue-800 dark:text-gray-800">{step.name}</span>
                </span>
                                    </div>
                                )}

                                {stepIdx !== steps.length - 1 ? (
                                    <>
                                        {/* Arrow separator for lg screens and up */}
                                        <div aria-hidden="true"
                                             className="absolute right-0 top-0 hidden h-full w-5 md:block">
                                            <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none"
                                                 className="size-full dark:text-gray-800 dark:text-opacity-100 text-blue-900 text-opacity-20">
                                                <path
                                                    d="M0 -2L20 40L0 82"
                                                    stroke="currentcolor"
                                                    vectorEffect="non-scaling-stroke"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </>
                                ) : null}
                            </li>
                    )
                }
            </ol>
        </nav>
    )
}