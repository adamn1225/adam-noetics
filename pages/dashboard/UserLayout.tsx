import Sidebar from '@components/Sidebar'; // Adjust path if needed
import React, { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-800">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md md:hidden">
        <button onClick={toggleSidebar} className="text-gray-900 dark:text-white">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </header>
      <div className="flex flex-1">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto p-4 md:ml-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;