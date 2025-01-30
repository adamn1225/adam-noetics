import Sidebar from '@components/Sidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';
import './client.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100  dark:bg-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;