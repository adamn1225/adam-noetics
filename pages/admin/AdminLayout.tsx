import AdminSidebar from '@components/AdminSidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-0 mt-32 md:mt-20 xl:ml-32 p-4 z-0 relative">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;