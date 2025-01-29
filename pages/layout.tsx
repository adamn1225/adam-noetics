import React, { ReactNode } from 'react';
import Navigation from '@components/Navigation';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Noetic Software and Web Key Solutions" />
                <link rel="canonical" href="https://noetics.io" />
                <title>Noetics Web Creations</title>
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
            </Head>
            <div className="antialiased bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
                <header className="bg-white dark:bg-gray-500 z-50 pt-2 fixed top-0 left-0 w-full dark:border-0 dark:border-gray-700">
                    <Navigation />
                </header>
                <main className="flex flex-col mt-16 min-h-screen">
                    {children}
                </main>
                <footer className="bg-gray-900 text-white py-6">
                    <div className="container mx-auto text-center">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                        </p>
                        <Link className='underline' href="/privacy-policy">
                            Privacy Policy
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default RootLayout;