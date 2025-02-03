import React, {useEffect, useRef, useState} from "react";
import {ExclamationCircleIcon} from "@heroicons/react/16/solid";

interface InputWithButtonProps {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    placeholder: string
    buttonLabel: string
    validate: (value: string) => { isValid: boolean; errorMessage?: string }
    loading: boolean
    handleSubmit: (e: React.FormEvent) => Promise<void>
}
export const InputWithButton: React.FC<InputWithButtonProps> = (
        {
            value,
            setValue,
            placeholder,
            buttonLabel,
            validate,
            loading,
            handleSubmit
        }
    ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');
    const componentRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (value.length > 0) {
            const result = validate(value);
            setIsValid(result.isValid);
            setError(result.errorMessage || '');
        } else {
            setIsValid(true);
            setError('');
        }
    }, [value])

    const handleButtonClick = async (e: React.FormEvent) => {
        e.preventDefault()
        if (value.length == 0) {
            setIsValid(false);
            setError('Please enter a collection name.');
            return
        }
        if (isValid) {
            await handleSubmit(e);
        }
    }

    // Add click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current &&
                !componentRef.current.contains(event.target as Node) &&
                value.length === 0) {
                setIsValid(true);
                setError('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [value]);

    return (
        <div className="relative" ref={componentRef}>
        <div className="flex max-w-7xl mx-auto rounded-lg overflow-hidden shadow-sm bg-theme-bg border-[1px] p-1 h-16 mb-2 mt-2">
            <div className={`flex rounded-lg flex-col flex-1 p-3 mr-2 relative`}> {/* Added relative for floating label positioning */}
                <label
                    className={`absolute transition-all duration-400 pointer-events-none
                    ${(isFocused || value)
                        ? 'text-sm text-gray-500 transform -translate-y-[8px]'
                        : 'text-md text-gray-500 transform translate-y-[3px]'}`}
                >
                    {placeholder}
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`bg-theme-bg text-base pt-2 font-normal text-theme-text focus:outline-none mt-1 w-full`}
                />
            </div>
            {
                !isValid && <ExclamationCircleIcon
                aria-hidden={true}
                className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-tertiary-700 sm:size-7"
            />
            }
            <div className="flex-none w-[45%] lg:w-[40%]">
                <button
                    disabled={!isValid || loading}
                    type="submit"
                    onClick={() => handleButtonClick}
                    className={`${!isValid || loading ? "bg-theme-text bg-opacity-[45%]" : "bg-secondary-600 hover:bg-secondary-700"} w-full h-full  rounded-lg text-white text-sm sm:text-lg font-semibold px-6 `}
                >
                    {loading ? (
                        <div className="flex justify-center align-middle">
                            <svg
                                className="animate-spin h-5 w-5 text-white mr-4 align-middle mt-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        buttonLabel
                    )}
                </button>
            </div>
        </div>
        <p className={`text-sm tracking-wide text-theme-bg ${isValid && 'opacity-0'} pb-1`}>
            {!isValid ? error : "..."}
        </p>
        </div>
    )
}