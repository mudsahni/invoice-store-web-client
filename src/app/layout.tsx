import type {Metadata} from "next";
import "./globals.css";
import {LayoutWrapper} from "@/components/LayoutWrapper";
import {Providers} from "@/contexts/Providers";
import {ThemeScript} from "@/contexts/ThemeScript";
import React from "react";

export const metadata: Metadata = {
  title: "Bookline",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
    <html lang="en" className="dark" >
      <body className={`antialiased`}>
      <ThemeScript />
      <Providers>
          <LayoutWrapper>
              {children}
          </LayoutWrapper>
      </Providers>
      </body>
    </html>
  );
}