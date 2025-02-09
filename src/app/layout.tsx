import type {Metadata} from "next";
import "./globals.css";
import {LayoutWrapper} from "@/components/LayoutWrapper";
import {Providers} from "@/contexts/Providers";
import {ThemeScript} from "@/contexts/ThemeScript";
import React from "react";

export const metadata: Metadata = {
    title: "Doxify",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className="light">
        <body className={`antialiased min-h-screen`}>
        <ThemeScript/>
        <Providers>
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </Providers>
        </body>
        </html>
    );
}