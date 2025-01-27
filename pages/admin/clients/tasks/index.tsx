// filepath: /home/adam-noah/adam-noah/src/app/admin/clients/tasks/page.tsx
"use client";
import React from 'react';
import AdminTasksPage from '../../components/AdminTasksPage';
import AdminLayout from '@/admin/AdminLayout';

const AdminTaskPage = () => {
    return (
        <>
            <AdminTasksPage />
        </>
    );
};
AdminTaskPage.getLayout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
export default AdminTaskPage;