'use client';

import {ValidationIcon} from "@/components/jsonviewer/ValidationIcon";

interface JsonFormFieldProps {
    label: string;
    value: any;
    validation?: any;
    onChange: (value: any) => void;
}

export const JsonFormField = ({ label, value, validation, onChange }: JsonFormFieldProps) => {
    const displayValue = value === null ? '' : value;
    const fieldType = typeof value === 'number' ? 'number' : 'text';

    return (
        <div className="flex items-center space-x-2">
            <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
                <input
                    type={fieldType}
                    value={displayValue}
                    onChange={(e) => onChange(fieldType === 'number' ? Number(e.target.value) : e.target.value)}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            {validation && (
                <div className="pt-6">
                    <ValidationIcon
                        status={validation.field_validation_status}
                        errors={validation.errors || []}
                    />
                </div>
            )}
        </div>
    );
};
