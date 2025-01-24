import Sidebar from '@components/Sidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-[200px,1fr] h-screen overflow-hidden">
      <Sidebar />
      <main className="mt-20 relative overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;