import Sidebar from '@components/Sidebar'; // Adjust path if needed
import TopNav from '@components/TopNav'; // Import the TopNav component
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;