// app/providers.tsx
'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import React from "react";
import {ThemeProvider} from "@/contexts/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AuthProvider>
    )
}