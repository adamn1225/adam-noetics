import React, { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Navigation from '@components/Navigation';
import Script from 'next/script';

interface RootLayoutProps {
    children: ReactNode;
}

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white`}>

            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=G-S9Q4511QJC`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-S9Q4511QJC');
                `}
            </Script>
            <Navigation />
            <div className="flex flex-col mt-16 min-h-screen">
                {children}
            </div>
            <footer className="bg-gray-900 text-white py-6">
                <div className="container mx-auto text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default RootLayout;