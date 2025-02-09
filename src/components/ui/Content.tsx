import React from 'react'

interface ContentProps {
    children: React.ReactNode;
    className?: string; // Optional prop for additional classes
}

export default function Content({children, className = ''}: ContentProps) {
    return (
        <div className={`max-w-7xl mx-auto sm:p-8 p-2 space-y-8 ${className}`}>
            {children}
        </div>
    )
}