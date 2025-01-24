// filepath: /home/adam-noah/adam-noah/src/app/admin/clients/tasks/page.tsx
"use client";
import React from 'react';
import AdminTasksPage from '../../components/AdminTasksPage';
import AdminLayout from '../../AdminLayout';

const Page = () => {
    return (
        <AdminLayout>
            <AdminTasksPage />
        </AdminLayout>
    );
};

export default Page;