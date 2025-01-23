'use client';

import { CheckCircle, XCircle } from 'lucide-react';

interface ValidationIconProps {
    status: string;
    errors: Array<{ message: string; error_level: string }>;
}

export const ValidationIcon = ({ status, errors }: ValidationIconProps) => {
    if (status === 'valid') {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (errors.length > 0) {
        return (
            <div className="group relative">
                <XCircle className="h-5 w-5 text-red-500" />
                <div className="absolute left-6 top-0 hidden group-hover:block bg-red-100 p-2 rounded shadow-lg z-10 w-64">
                    {errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700">
                            {error.message} ({error.error_level})
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};