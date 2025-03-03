import BuilderSideNav from './BuilderSideNav'; // Adjust path if needed
import BuilderSideNav from './BuilderSideNav'; // Import the TopNav component
import React, { ReactNode } from 'react';



const BuilderLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <BuilderSideNav />
            <div className="flex-1 flex flex-col">
                <TopNav />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BuilderLayout;