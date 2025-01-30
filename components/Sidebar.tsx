'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Home, Folder, ClipboardList, BarChart, User, LogOut, Settings, Moon, Sun, Calendar, MonitorCog } from 'lucide-react';
import { supabase } from '@lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import placeholderAvatar from '@public/placeholder-avatar.png';
import noeticsLogoDark from '@public/noeticslogo-dark.png';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'File Uploads', href: '/dashboard/files', icon: Folder },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'Content Management System', href: '/dashboard/CMS', icon: MonitorCog },
  { name: 'Calendar', href: '/dashboard/sm-calendar', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentPath = usePathname();

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

      // Check if the user signed in with Google SSO and has a profile picture URL
      if (user.user_metadata.avatar_url && !profile.profile_image) {
        try {
          const response = await fetch(user.user_metadata.avatar_url);
          const blob = await response.blob();
          const fileName = `${user.id}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);

          const publicUrl = publicUrlData.publicUrl;

          // Update the profile with the new profile image URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ profile_image: publicUrl })
            .eq('user_id', user.id);

          if (updateError) {
            throw updateError;
          }

          profile.profile_image = publicUrl;
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      }

      setProfile(profile);
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      startTransition(() => {
        router.push('/login');
      });
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <aside className={`bg-gray-900 dark:bg-gray-900 pb-28 text-white transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-44'} overflow-hidden relative`}>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
      )}
      <div className='flex items-center justify-center p-4'>
        <Image
          src={isDarkMode ? noeticsLogoDark : noeticsLogoDark}
          alt="Noetics.io Logo"
          width={160} // Adjust the width as needed
          height={40} // Adjust the height as needed
          className="rounded-full"
        />
      </div>
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
            src={profile.profile_image}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Image
            src={placeholderAvatar}
            alt="Placeholder Avatar"
            width={96}
            height={96}
            className="rounded-full mr-4"
          />
        )}
        <div className={` ${isCollapsed ? 'hidden' : 'flex flex-nowrap justify-center gap-1'}`}>
          <p className="text-sm font-medium">Welcome,</p>
          <p className="text-sm font-bold">{profile?.name}</p>
        </div>
      </div>
      <nav className="mt-4 flex flex-col justify-between h-full">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} passHref legacyBehavior>
                <a className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'} p-2 text-sm font-medium hover:bg-gray-700 rounded ${currentPath === item.href ? 'active' : ''}`}>
                  <item.icon className="md:mr-2" />
                  <span className={`text-base ${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mb-32">
          <ul className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : 'items-start ml-2'}`}>
            <li className="mb-6">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-start p-2 text-nowrap text-sm font-semibold text-gray-800 bg-gray-300 dark:bg-gray-800 dark:text-gray-200 rounded w-full text-left"
              >
                {isDarkMode ? <Sun className="mr-1" /> : <Moon className="mr-1" />}
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{isDarkMode ? 'Enable Light Mode' : 'Enable Dark Mode'}</span>
              </button>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/settings" passHref legacyBehavior>
                <a className={`flex items-center${isCollapsed ? 'justify-center' : 'justify-normal'}  p-2 text-base font-medium hover:bg-gray-700 rounded ${currentPath === '/dashboard/settings' ? 'active' : ''}`}>
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