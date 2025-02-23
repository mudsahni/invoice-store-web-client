import React from 'react';
import {Check} from "lucide-react";

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
        <div className={`
            ${className || ""} 
            group w-full sm:w-[20rem] 
            rounded-xl 
            flex items-center justify-start 
            space-x-4 p-4 sm:mx-4 
            transition-all duration-500 ease-in-out
            hover:shadow-md
        `}>
            {children}
        </div>
    );
};

const NewActiveStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-dashed border-yellow-600">
            <div
                className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-yellow-500 rounded-xl animate-pulse opacity-20"></div>
                <span className="text-xl text-white font-bold">{step.id}</span>
            </div>
            <div className="flex flex-col">
                <div className="text-yellow-800 font-semibold">{step.name}</div>
                <div className="text-yellow-600 text-sm">In Progress</div>
            </div>
        </BaseStep>
    );
};

const NewCompletedStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-600">
            <div
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-sm">
                <Check className="h-6 w-6 text-white stroke-[3]"/>
            </div>
            <div className="flex flex-col">
                <div className="text-green-800 font-semibold">{step.name}</div>
                <div className="text-green-600 text-sm">Completed</div>
            </div>
        </BaseStep>
    );
};

const NewToDoStep = ({step}: { step: Step }) => {
    return (
        <BaseStep className="bg-white border-2 border-dashed border-gray-200 hover:border-sky-200 hover:bg-sky-50/30">
            <div
                className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-sky-100 transition-colors duration-300">
                <span className="text-xl text-gray-400 font-medium group-hover:text-sky-600">{step.id}</span>
            </div>
            <div className="flex flex-col">
                <div className="text-gray-400 font-semibold group-hover:text-sky-800">{step.name}</div>
                <div className="text-gray-400 text-sm group-hover:text-sky-600">Pending</div>
            </div>
        </BaseStep>
    );
};

export const Steps: React.FC<StepsProps> = ({steps}) => {
    return (
        <nav aria-label="Progress" className="px-4 py-8">
            <ol role="list" className="relative grid grid-cols-1 xl:grid-cols-4 gap-6 place-items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className="relative w-full flex justify-center">
                        {step.status === StepStatus.COMPLETED ? (
                            <NewCompletedStep step={step}/>
                        ) : step.status === StepStatus.IN_PROGRESS ? (
                            <NewActiveStep step={step}/>
                        ) : (
                            <NewToDoStep step={step}/>
                        )}

                        {stepIdx !== steps.length - 1 && (
                            <div
                                aria-hidden="true"
                                className="hidden xl:block absolute top-1/2 left-full w-16 h-0.5 -translate-y-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                            />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};