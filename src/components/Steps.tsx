import React from 'react'
import {CheckIcon, Combine} from "lucide-react";

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

interface BaseStepProps {
    className?: string;
    children: React.ReactNode;
}


const BaseStep: React.FC<BaseStepProps> = ({className, children}) => {
    return (
        <div
            className={` ${className || ""} group sm:w-[20rem] w-full rounded-md flex align-middle items-center justify-start space-x-4 p-4 sm:mx-4 transition-transform duration-500 border-2`}>
            {children}
        </div>
    )
}

const NewActiveStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className="bg-yellow-50 border-dashed border-yellow-800">
            <div
                className="h-[3rem] w-[3rem] py-2 px-3 rounded-lg bg-yellow-800 text-xl text-white font-medium flex align-middle text-center">
                <span>{step.id}</span></div>
            <div className="text-yellow-800 font-semibold">{step.name}</div>
        </BaseStep>
    )
}

const NewCompletedStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className="bg-green-50 border-green-800">
            <div className="py-2 px-3 h-[3rem] w-[3rem] rounded-lg bg-green-600 text-white font-medium"><CheckIcon
                className="h-8"/>
            </div>
            <div className="text-green-800 font-semibold">{step.name}</div>
        </BaseStep>
    )
}


const NewToDoStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className={"border-dashed border-sky-800 border-opacity-20"}>
            <div
                className="h-[3rem] w-[3rem] py-2 px-3 group-hover:bg-indigo-600 text-xl transition-transform duration-500 rounded-lg bg-sky-800 bg-opacity-20 text-white font-medium flex align-middle text-center">

                <span>{step.id}</span>
            </div>
            <div className="text-sky-800 text-opacity-20">
                <div className="font-semibold">{step.name}</div>
            </div>
        </BaseStep>
    )
}

export const Steps: React.FC<StepsProps> = ({steps}) => {
    return (
        <nav aria-label="Progress">
            <ol role="list"
                className="mb-8 grid grid-cols-1 xl:grid-cols-4 gap-4 place-items-center relative">
                {
                    steps.map((step, stepIdx) =>
                        <li key={step.name} className="relative w-full flex justify-center">
                            {step.status === StepStatus.COMPLETED ? (
                                <NewCompletedStep step={step}/>
                            ) : step.status === StepStatus.IN_PROGRESS ? (
                                <NewActiveStep step={step}/>
                            ) : (
                                <NewToDoStep step={step}/>
                            )}

                            {stepIdx !== steps.length - 1 ? (
                                <>
                                    {/* Line separator */}
                                    <div aria-hidden="true"
                                         className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-[calc(100%-1.2rem)] w-16 h-px bg-green-800 z-1">
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