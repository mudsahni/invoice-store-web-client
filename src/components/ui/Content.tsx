import React from 'react'

interface ContentProps {
    children: React.ReactNode;
    className?: string; // Optional prop for additional classes
}

export default function Content({children, className = ''}: ContentProps) {
    return (
        <div className={`max-w-8xl mx-auto sm:py-8 sm:px-32 p-2 space-y-8 ${className}`}>
            {children}
        </div>
    )
}