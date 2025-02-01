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

    // Check token expiration
// Check token expiration
    const checkTokenExpiration = async () => {
        const BUFFER_TIME = 5 * 60 * 1000; // 5 minutes buffer
        const authData = localStorage.getItem(`firebase:authUser:${auth.config.apiKey}:[DEFAULT]`);
        if (authData) {
            const userData = JSON.parse(authData);
            const expirationTime = userData?.stsTokenManager?.expirationTime;

            // Add logging to debug
            console.log('Token check - Current time:', new Date(Date.now()));
            console.log('Token check - Expiration time:', new Date(expirationTime));
            console.log('Token check - Time until expiration (minutes):',
                (expirationTime - Date.now()) / (1000 * 60));

            if (expirationTime && (Date.now() + BUFFER_TIME) >= expirationTime) {
                // Only sign out if we're really expired, not just close to expiring
                if (Date.now() >= expirationTime) {
                    console.log('Token expired, signing out user');
                    await signOut();
                    return false;
                }
                // If we're in the buffer period, let Firebase try to refresh the token
                console.log('Token nearing expiration, allowing refresh attempt');
            }
            return true;
        }
        return false;
    };


    const signIn = async (email: string, password: string) => {
        try {
            console.log('Attempting sign in...');

            // Set persistence to local (persists even after browser restart)
            await setPersistence(auth, browserLocalPersistence);

            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Sign in successful:', userCredential.user.uid);

            // Debug token information
            const token = await userCredential.user.getIdToken();
            const tokenResult = await userCredential.user.getIdTokenResult();

            console.log('Token expiration:', new Date(tokenResult.expirationTime));
            console.log('Current time:', new Date());
            console.log('Token valid for (minutes):',
                (new Date(tokenResult.expirationTime).getTime() - Date.now()) / (1000 * 60)
            );
// // Store tenant info immediately after successful login
            // // This ensures tenant info is available for the auth state change listener
            // const userData = await fetchUserData('YOUR_TENANT_ID', userCredential.user.uid);
            // if (userData?.tenantId) {
            //     const tenantData = await fetchTenantData(userData.tenantId);
            //     if (tenantData) {
            //         localStorage.setItem('tenant', JSON.stringify({
            //             id: userData.tenantId,
            //             // Add any other necessary tenant info
            //         }));
            //         console.log('Tenant data stored:', userData.tenantId);
            //     }
            // }

            // Navigation will happen automatically through the onAuthStateChanged listener
            // which will fetch user data and redirect if successful
        } catch (error: any) {
            console.error('Sign in error:', error);
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
        console.log('Setting up auth state listener...');
        let isInitialCheck = true;  // Add this flag

        console.log('Setting up auth state listener...');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                console.log('Auth state changed. User:', firebaseUser?.uid);
                // Check token expiration first
                // Skip expiration check on initial auth state change
                if (!isInitialCheck) {
                    // Check token expiration
                    if (!await checkTokenExpiration()) {
                        console.log("Token expired, skipping auth state change");
                        return;
                    }
                }
                isInitialCheck = false;

                // Get tenant from localStorage
                const savedTenant = localStorage.getItem('tenant');
                console.log('Saved tenant:', savedTenant);
                let tenantDetails = null;
                if (savedTenant) {
                    tenantDetails = JSON.parse(savedTenant);
                }

                setUser(firebaseUser);

                if (firebaseUser && tenantDetails) {
                    console.log('Fetching user data for tenant:', tenantDetails.id);
                    // Fetch user data from Firestore
                    const userData = await fetchUserData(tenantDetails.id, firebaseUser.uid);
                    if (!userData) {
                        console.error('User data not found in Firestore');
                        await auth.signOut();
                        return;
                    }

                    console.log('User data fetched:', userData);
                    // Fetch tenant data from Firestore
                    console.log('Fetching tenant data...');
                    const tenantData = await fetchTenantData(tenantDetails.id);
                    if (!tenantData) {
                        console.error('Tenant data not found');
                        await auth.signOut();
                        return;
                    }

                    setAuthUser(userData);
                    setTenant(tenantData);

                    // Only redirect to collections if we're on the login page
                    if (window.location.pathname === '/login') {
                        console.log('Redirecting to collections...');
                        router.push('/collections');
                    }
                } else {
                    console.log('No user or tenant data, clearing states');
                    setAuthUser(null);
                    setTenant(null);

                    // If no user or tenant, and we're not on login page, redirect to login page
                    if (window.location.pathname !== '/login') {
                        console.log('Redirecting to login...');
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

        // Modify the interval to be less frequent and add some guards
        const tokenCheckInterval = setInterval(async () => {
            if (auth.currentUser) {  // Only check if we have a user
                try {
                    // Try to refresh the token first
                    await auth.currentUser.getIdToken(true);
                } catch (error) {
                    console.error('Error refreshing token:', error);
                }
                await checkTokenExpiration();
            }
        }, 5 * 60 * 1000); // Check every 5 minutes instead of every minute


        // Cleanup subscription on unmount
        return () => {
            console.log('Cleaning up auth state listener...');
            unsubscribe();
            clearInterval(tokenCheckInterval);
        }
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