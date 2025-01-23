import React from "react";

interface UserFieldProps {
    name: string
    email?: string
}

const bgColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
];


export const UserField: React.FC<UserFieldProps> = ({name, email}) => {
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

    // Get the initials from the name
    const initials = name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return (
            <div className="flex items-center">
                <div className={`size-11 shrink-0 ${randomBgColor} w-10 h-10 text-sm text-white rounded-full flex items-center justify-center font-bold`}>
                    {initials}
                </div>
                <div className="ml-4">
                    <div className="font-medium text-slate-900">{name}</div>
                    <div className="mt-1 text-slate-500">{email}</div>
                </div>
            </div>
    )
}