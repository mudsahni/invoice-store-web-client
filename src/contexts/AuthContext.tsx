'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchUserData, fetchTenantData } from '@/lib/firestore';
import { UserData, Tenant } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    authUser: UserData | null;
    tenant: Tenant | null;
    setTenant: React.Dispatch<React.SetStateAction<Tenant | null>>;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many failed login attempts. Please try again later.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        default:
            return 'An error occurred during login. Please try again.';
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [, setUser] = useState<User | null>(null);
    const [authUser, setAuthUser] = useState<UserData | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const signIn = async (email: string, password: string) => {
        try {
            // Set persistence to local (persists even after browser restart)
            await setPersistence(auth, browserLocalPersistence);

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, email, password);

            // Navigation will happen automatically through the onAuthStateChanged listener
            // which will fetch user data and redirect if successful
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            throw new Error(errorMessage);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setAuthUser(null);
            setTenant(null);
            localStorage.removeItem('tenant');
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                // Get tenant from localStorage
                const savedTenant = localStorage.getItem('tenant');
                let tenantDetails = null;
                if (savedTenant) {
                    tenantDetails = JSON.parse(savedTenant);
                }

                setUser(firebaseUser);

                if (firebaseUser && tenantDetails) {
                    // Fetch user data from Firestore
                    const userData = await fetchUserData(tenantDetails.id, firebaseUser.uid);
                    if (!userData) {
                        console.error('User data not found in Firestore');
                        await auth.signOut();
                        return;
                    }

                    // Fetch tenant data from Firestore
                    const tenantData = await fetchTenantData(tenantDetails.id);
                    if (!tenantData) {
                        console.error('Tenant data not found');
                        await auth.signOut();
                        return;
                    }

                    setAuthUser(userData);
                    setTenant(tenantData);

                    // Only redirect to dashboard if we're on the login page
                    if (window.location.pathname === '/login') {
                        router.push('/dashboard');
                    }
                } else {
                    setAuthUser(null);
                    setTenant(null);

                    // If no user or tenant, and we're not on login page, redirect to login page
                    if (window.location.pathname !== '/login') {
                        router.push('/login');
                    }
                }
            } catch (error) {
                console.error('Error in auth state change:', error);
                setAuthUser(null);
                setTenant(null);
            } finally {
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    return (
        <AuthContext.Provider value={{ authUser, tenant, setTenant, loading, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}