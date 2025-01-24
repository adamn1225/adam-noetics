import AdminSidebar from '@components/AdminSidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';


interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="grid grid-cols-[200px,1fr] min-h-screen">
            <AdminSidebar />
            <main className="ml-0 mt-32 md:mt-20 xl:ml-52 p-4 z-0 relative">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;