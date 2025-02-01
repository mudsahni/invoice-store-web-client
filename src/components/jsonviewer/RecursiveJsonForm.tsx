'use client';

import { JsonFormField } from './JsonFormField';

interface RecursiveJsonFormProps {
    data: any;
    validation?: any;
    path?: string[];
    onChange: (path: string[], value: any) => void;
}

export const RecursiveJsonForm = ({
                                      data,
                                      validation,
                                      path = [],
                                      onChange
                                  }: RecursiveJsonFormProps) => {
    if (Array.isArray(data)) {
        return (
            <div className="pl-4 space-y-4">
                {data.map((item, index) => (
                    <div key={index} className="border-l-2 border-gray-700 pl-4">
                        <h4 className="text-gray-300 font-medium mb-2">Item {index + 1}</h4>
                        <RecursiveJsonForm
                            data={item}
                            validation={validation?.[index]}
                            path={[...path, index.toString()]}
                            onChange={onChange}
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (typeof data === 'object' && data !== null) {
        return (
            <div className="space-y-4">
                {Object.entries(data).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return (
                            <div key={key} className="bg-gray-800 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-200 mb-3 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </h3>
                                <RecursiveJsonForm
                                    data={value}
                                    validation={validation?.[key]}
                                    path={[...path, key]}
                                    onChange={onChange}
                                />
                            </div>
                        );
                    }

                    return (
                        <JsonFormField
                            key={key}
                            label={key.replace(/_/g, ' ')}
                            value={value}
                            validation={validation?.[key]}
                            onChange={(newValue) => onChange([...path, key], newValue)}
                        />
                    );
                })}
            </div>
        );
    }

    return null;
};