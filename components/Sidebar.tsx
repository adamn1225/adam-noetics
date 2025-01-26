'use client';

import React, { useState, useEffect } from 'react';
import { Home, FileText, ClipboardList, BarChart, User, LogOut, List, Settings, Moon, Sun } from 'lucide-react';
import { supabase } from '@lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'File Uploads', href: '/dashboard/files', icon: FileText },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

const adminNavItems = [
  { name: 'Admin Tasks', href: '/admin/clients/tasks', icon: List },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Failed to fetch user profile', profileError);
        return;
      }

      setProfile(profile);
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <aside className={`bg-gray-900 pb-28 text-white transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-44'} overflow-hidden relative`}>
      <div className="flex items-center justify-between p-4">
        <h2 className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
          Dashboard
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white font-extra flex justify-center w-full bold text-xl focus:outline-none underline"
          style={{ zIndex: 10 }}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>
      <div className="flex flex-col justify-start gap-1 items-center p-4">
        {profile?.profile_image ? (
          <Image
            src={`${supabase.storage.from('profile-pictures').getPublicUrl(profile.profile_image).data.publicUrl}`}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-[10px]">No Avatar</span>
          </div>
        )}
        <div className={` ${isCollapsed ? 'hidden' : 'flex flex-nowrap justify-center gap-1'}`}>
          <p className="text-sm font-medium">Welcome,</p>
          <p className="text-sm font-bold">{profile?.name}</p>
        </div>
      </div>
      <nav className="mt-4 flex flex-col justify-between h-full">
        <ul>
          <li className="mb-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded w-full text-left"
            >
              {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </li>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} passHref legacyBehavior>
                <a className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded">
                  <item.icon className="mr-2" />
                  <span className={`text-base ${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
          {profile?.role === 'admin' && adminNavItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} passHref legacyBehavior>
                <a className={`flex ${isCollapsed ? 'justify-center' : 'justify-normal'} items-center p-2 text-base font-medium hover:bg-gray-700 rounded`}>
                  <item.icon className="mr-2" />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mb-20">
          <ul className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : 'items-start ml-2'}`}>
            <li className="mb-2">
              <Link href="/dashboard/settings" passHref legacyBehavior>
                <a className="flex items-center${isCollapsed ? 'justify-center' : 'justify-normal'}  p-2 text-base font-medium hover:bg-gray-700 rounded">
                  <Settings className="mr-2" />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                </a>
              </Link>
            </li>
            <li className="mb-2">
              <button onClick={handleLogout} className="flex items-center p-2 text-base font-medium hover:bg-gray-700 rounded w-full text-left">
                <LogOut className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;