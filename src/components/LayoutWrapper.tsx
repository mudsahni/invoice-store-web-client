'use client';

import {usePathname} from 'next/navigation';
import Navigation from "@/components/ui/nav/navbar";
import Footer from "@/components/ui/footer/footer";
import React from "react";

export function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login';

    return (
        <>
            {!isAuthPage && <Navigation/>}
            <main className="min-h-[60vh]">{children}</main>
            {!isAuthPage && <Footer/>}
        </>
    );
}
