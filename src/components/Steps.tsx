import React from 'react'

enum StepStatus {
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
                className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
                {
                    steps.map(step =>
                        <div></div>
                    )
                }
            </ol>
        </nav>
    )
}