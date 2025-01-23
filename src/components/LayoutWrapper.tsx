'use client';

import { usePathname } from 'next/navigation';
import Navigation from "@/components/ui/nav/navbar";
import Footer from "@/components/ui/footer/footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login';

    return (
        <>
            {!isAuthPage && <Navigation />}
            <main className="dark:bg-black-800">{children}</main>
            {!isAuthPage && <Footer />}
        </>
    );
}
