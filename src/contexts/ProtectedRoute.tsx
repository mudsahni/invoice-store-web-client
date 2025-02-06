// src/components/ProtectedRoute.tsx
'use client';

import {useAuthRedirect} from '@/hooks/useAuthRedirect';
import React from "react";
import {LoadingSpinner} from "@/components/LoadingSpinner";

export default function ProtectedRoute({children}: { children: React.ReactNode }) {
    const {authUser, loading} = useAuthRedirect();

    if (loading) return <div><LoadingSpinner size={6}/></div>;
    if (!authUser) return null;

    return <>{children}</>;
}