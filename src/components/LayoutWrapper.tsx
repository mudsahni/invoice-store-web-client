'use client';

import {usePathname} from 'next/navigation';
import Navigation from "@/components/ui/nav/navbar";
import Footer from "@/components/ui/footer/footer";
import React from "react";

export function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login';

    return (
        <div className="min-h-screen flex flex-col px-2 sm:px-0">
            {!isAuthPage && <Navigation/>}
            <main
                className="dark:bg-gray-900 flex-grow">{children}</main>
            {!isAuthPage && <Footer/>}
        </div>
    );
}
