'use client';

import React, { useState, useEffect } from 'react';
import { Home, FileText, ClipboardList, BarChart, User, LogOut, List, Settings } from 'lucide-react';
import { supabase } from '@lib/supabaseClient';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard/', icon: Home },
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
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Failed to fetch user role', profileError);
        return;
      }

      setRole(profile.role);
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
      <div className="flex items-center justify-between p-4">
        <h2 className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          Dashboard
        </h2>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white focus:outline-none">
          {isCollapsed ? '>' : '<'}
        </button>
      </div>
      <nav className="mt-4 flex flex-col justify-between h-full">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a href={item.href} className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded">
                <item.icon className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </a>
            </li>
          ))}
          {role === 'admin' && adminNavItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a href={item.href} className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded">
                <item.icon className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <ul>
          <li className="mb-2">
            <a href="/dashboard/settings" className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded">
              <Settings className="mr-2" />
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
            </a>
          </li>
          <li className="mb-2">
            <button onClick={handleLogout} className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded w-full text-left">
              <LogOut className="mr-2" />
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;