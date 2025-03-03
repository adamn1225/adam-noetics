import React from 'react';
import { Editor } from "@craftjs/core";
import BuilderSideNav from './BuilderSideNav';
import BuilderTopNav from './BuilderTopNav';

const BuilderLayout = ({ children }) => {
    return (
        <Editor>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <BuilderSideNav />
                <div className="flex-1 flex flex-col">
                    <BuilderTopNav />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </Editor>
    );
};

export default BuilderLayout;