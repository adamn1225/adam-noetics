import React from 'react';
import BuilderSideNav from './BuilderSideNav'; // Import the SideNav component
import BuilderTopNav from './BuilderTopNav'; // Import the TopNav component

const BuilderLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <BuilderSideNav />
            <div className="flex-1 flex flex-col">
                <BuilderTopNav />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BuilderLayout;