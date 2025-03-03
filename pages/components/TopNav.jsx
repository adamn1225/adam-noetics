"use client";
import React from 'react';
import { Settings } from 'lucide-react';
import SaveTemplate from './SaveTemplate';

const TopNav = () => {

    return (
        <>
            <div className="flex justify-between items-center gap-4 py-2 shadow-md bg-gray-950 text-white">
               
                   <div className="flex justify-start items-center gap-4 pl-20">
                        <span className='bg-gray-700 px-2 py-1 shadow-md shadow-primary'> Dashboard</span>
                        <span className='bg-gray-700 px-2 py-1 shadow-md shadow-primary'>Components</span>
                        <span className='bg-gray-700 px-2 py-1 shadow-md shadow-primary'>Layouts</span>
                   </div>
         <div className="flex justify-end items-center gap-4 pr-12">
               <span className='bg-gray-700 px-2 py-1 shadow-sm shadow-primary'><Settings/></span>
         </div>
            </div>

        </>
    );
};

export default TopNav;