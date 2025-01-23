'use client'
// components/auth/OrganizationSelect.tsx
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {Tenant} from "@/types/auth";
import {useAuth} from "@/contexts/AuthContext";


export const OrganizationSelect = ({ onNext }: { onNext: () => void }) => {
    const {setTenant} = useAuth();
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const tenantsRef = collection(db, 'tenants');
            const q = query(
                tenantsRef,
                where('name', '==', orgName.trim())
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Organization not found. Please check the name and try again.');
                return;
            }

            const tenantDoc = querySnapshot.docs[0];
            const tenant: Tenant = {
                id: tenantDoc.id,
                ...tenantDoc.data()
            } as Tenant;

            setTenant(tenant);

            localStorage.setItem('tenant', JSON.stringify(tenant));
            onNext();
        } catch (err) {
            console.error('Error finding organization:', err);
            setError('An error occurred while validating the organization.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
                    <p className="text-gray-600">Enter your organization name to continue</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organization Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Enter your organization name"
                            required
                        />
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
                                Validating...
                            </span>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};