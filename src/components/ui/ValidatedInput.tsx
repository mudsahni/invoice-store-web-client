import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/16/solid'
import React, {useState, useEffect, useImperativeHandle, useRef} from "react";

interface ValidatedInputProps {
    id: string
    defaultValue: string
    label?: string
    placeholder: string
    validate: (value: string) => { isValid: boolean; errorMessage?: string }
    onChange?: (value: string, isValid: boolean) => void
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
                                                                  id,
                                                                  defaultValue,
                                                                  label,
                                                                  placeholder,
                                                                  validate,
                                                                  onChange
                                                              }) => {
    const [value, setValue] = useState(defaultValue);
    const [validation, setValidation] = useState<{isValid: boolean, errorMessage?: string | undefined}>({ isValid: true, errorMessage: undefined });
    const [touched, setTouched] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const debounceMs = 500

    // Use ref to store timeout ID
    const debounceTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (touched) {
            setIsDebouncing(true);
            // Clear any existing timeout
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            // Set new timeout
            debounceTimeout.current = setTimeout(() => {
                const result = validate(value);
                setValidation(result);
                setIsDebouncing(false);
                onChange?.(value, result.isValid);
            }, debounceMs);
        }

        // Cleanup timeout on unmount or value change
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [value, validate, touched, onChange, debounceMs]);

    const getInputStyles = () => {
        if (!touched || value.length == 0 || isDebouncing) return 'outline-gray-200 focus:outline-white text-gray-100';

        return validation.isValid ? 'outline-gray-200 focus:outline-white text-gray-100 bg-green-700' : 'outline-gray-200 focus:outline-white text-red-100 bg-red-400'
    };

    return (
        <div className="py-4 bg-white px-8">
            {/*{ label && <label htmlFor={id} className="block text-sm/6 font-medium tracking-wide text-gray-200">*/}
            {/*    {label}*/}
            {/*</label>}*/}
            <div className="mt-2 grid grid-cols-1">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setTouched(true)}
                    id={id}
                    name={id}
                    type={id}
                    placeholder={placeholder}
                    aria-invalid={touched && !validation.isValid && !isDebouncing}
                    aria-describedby={touched && !validation.isValid ? `${id}-error` : undefined}
                    className={`col-start-1 row-start-1 block w-full h-12 dark:bg-white rounded-md py-1.5 pl-3 pr-10 text-base 
                        outline outline-1 -outline-offset-1
                        focus:outline focus:outline-1 focus:-outline-offset-1
                        ${getInputStyles()}
                        sm:pr-9 sm:text-sm/6`}
                />
                {touched && value.length > 0 && !isDebouncing && (
                    validation.isValid ? (
                        <CheckCircleIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-green-400 sm:size-4"
                        />
                    ) : (
                        <ExclamationCircleIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-pink-800 sm:size-4"
                        />
                    )
                )}
            </div>
            {touched && !validation.isValid && value.length > 0 && !isDebouncing && (
                <p id={`${id}-error`} className="mt-2 text-sm tracking-wide text-gray-100">
                    {validation.errorMessage}
                </p>
            )}
        </div>
    )
}