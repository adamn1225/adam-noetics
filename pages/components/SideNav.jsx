'use client';

import React, { useState } from 'react';
import { Folder, ClipboardList, Settings, MonitorCog, LayoutPanelLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import nextlogo from '../../public/next_noetics.png';
import logomin from '../../public/next_noetics_ico.png';

const navItems = [
  { name: 'CMS', href: '/', icon: MonitorCog },
  { name: 'File Uploads', href: '/', icon: Folder },
  { name: 'Tasks', href: '/', icon: ClipboardList },
];

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();
 
  return (
    <aside className={`relative z-50 bg-gray-950 h-screen pb-28 text-white transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-36'} overflow-hidden relative z-50`}>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 animate-pulse"></div>
      )}

      <div className="flex items-center justify-normal h-14 bg-gray-950">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-white font-extrabold flex justify-center w-full text-2xl focus:outline-none underline`}
          style={{ zIndex: 10 }}
        >
          {isCollapsed ? <LayoutPanelLeft /> : <LayoutPanelLeft size={32} />}
        </button>
      </div>
      <div className={`flex items-center ${isCollapsed ? 'justify-center pt-2 pb-4' : 'justify-start  py-4 pr-4'} gap-1 w-full pl-1`}>
        <Image
          src={isCollapsed ? logomin : nextlogo}
          alt="Noetics.io Logo"
          width={isCollapsed ? 40 : 140} // Adjust the width as needed
          height={isCollapsed ? 40 : 100} // Adjust the height as needed
          className="rounded-full "
        />
      </div>
      <div className="flex flex-col justify-start gap-1 items-start p-4">
        <div className={` ${isCollapsed ? 'hidden' : 'flex flex-nowrap justify-center w-full gap-1'}`}>
        </div>
        <span className=" inline-flex justify-center w-full items-center">
          {/* <DarkModeToggle /> */}
        </span>
      </div>
      <nav className="flex flex-col justify-between h-full pb-8  text-xs xl:text-base">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2  text-xs 2xl:text-base">
              <Link href={item.href} passHref className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'} p-2 font-medium hover:bg-gray-700 rounded ${currentPath === item.href ? 'active' : ''}`}>
                <item.icon className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="xl:mb-12 text-xs xl:text-base">
          <ul className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : 'items-start 2xl:ml-2'}`}>
            <li className="text-xs 2xl:text-base">
              <Link href="/" passHref className={`flex items-center${isCollapsed ? 'justify-center' : 'justify-start gap-2'}  p-2 font-medium hover:bg-gray-700 rounded ${currentPath === '/' ? 'active' : ''}`}>
                <Settings className="mr-2 " />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default SideNav;