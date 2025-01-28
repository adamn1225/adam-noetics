import React, { ReactNode } from 'react';
import Navigation from '@components/Navigation';

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
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