import React, {useEffect, useRef, useState} from "react";
import {CheckCircleIcon, ExclamationCircleIcon} from "@heroicons/react/16/solid";
import {Button} from "@/components/ui/button";

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
    const [error, setError] = useState('garbage');
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
        <div className="flex max-w-7xl mx-auto rounded-lg overflow-hidden shadow-sm bg-gray-200 p-1 h-16 mb-2 mt-2">
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
                    className={`bg-gray-200 text-base pt-2 font-normal text-gray-800 focus:outline-none mt-1 w-full`}
                />
            </div>
            {
                !isValid && <ExclamationCircleIcon
                aria-hidden={true}
                className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-pink-800 sm:size-8"
            />
            }
            <div className="flex-none w-[45%] lg:w-[40%]">
                <button
                    type="submit"
                    onClick={() => handleButtonClick}
                    className='w-full h-full bg-green-700 rounded-lg text-white text-base sm:text-lg font-semibold px-6 hover:bg-green-800'
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
        <p className={`text-sm tracking-wide text-gray-200 ${isValid && 'opacity-0'} pb-1`}>
            {!isValid ? error : "..."}
        </p>
        </div>
    )
}