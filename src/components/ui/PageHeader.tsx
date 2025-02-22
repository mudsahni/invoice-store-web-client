import React from 'react'

interface PageHeaderProps {
    title: string;
}

export default function PageHeader({title}: PageHeaderProps) {
    return (
        <span
            className="sm:text-8xl text-5xl dark:text-gray-200 text-gray-800 font-bold">
            {title}
        </span>
    )
}