import React from "react";

export enum StatusType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
}
interface StatusButtonProps {
    type: StatusType
    label: string
}

export const StatusButton: React.FC<StatusButtonProps> = ({type, label}) => {
    const commonStyles = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
    const conditionalStyles = type === StatusType.Error ? 'bg-red-50 text-red-700 ring-red-600/20' : type === StatusType.Warning ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : type === StatusType.Info ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-green-50 text-green-700 ring-green-600/20'
    return (
        <span
            className={`${commonStyles} ${conditionalStyles}`}>
           {label.toUpperCase()}
        </span>

    )
}