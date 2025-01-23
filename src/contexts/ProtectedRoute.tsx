// src/components/ProtectedRoute.tsx
'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { authUser, loading } = useAuthRedirect();

    if (loading) return <div>Loading...</div>;
    if (!authUser) return null;

    return <>{children}</>;
}