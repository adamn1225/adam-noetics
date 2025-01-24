import Sidebar from '@components/Sidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';


interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-[200px,1fr] min-h-screen">
      <Sidebar />
      <main className="ml-0 mt-32 md:mt-20 xl:ml-52 p-4 z-0 relative">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;