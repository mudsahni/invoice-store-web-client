// src/components/ui/LoginForm.tsx

'use client';

import React, {useEffect, useState} from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
    const { tenant, signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isTenantAvailable, setIsTenantAvailable] = useState<boolean>(true)
    const [savedTenantJson, setSavedTenantJson] = useState<any>({name: "UNAVAILABLE"})

    useEffect(() => {
        const savedTenant = localStorage.getItem('tenant')
        if (!savedTenant && !tenant) {
            router.push('/login')
        }

        if (savedTenant) {
            setSavedTenantJson(JSON.parse(savedTenant))
            setIsTenantAvailable(false)
        }

    }, [])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError('');
            await signIn(email, password)
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error("Unexpected error:", err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
        { isTenantAvailable ? (<div>crap</div>) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome to {savedTenantJson.name}
                </h2>
                <p className="text-gray-600">Please sign in to continue</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <div className="flex justify-between items-center">
                        <AlertDescription>{error}</AlertDescription>
                        <button
                            onClick={() => setError('')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={16}/>
                        </button>
                    </div>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            id="remember-me"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium 
              ${!isLoading && 'hover:bg-blue-700'} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              transform transition-all duration-200 
              ${!isLoading && 'hover:scale-[1.02]'}
              ${isLoading && 'opacity-75 cursor-not-allowed'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Signing in...
                            </span>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>
        </div>
    </div>
    )
}
</>
    )
};