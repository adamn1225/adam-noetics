import React from 'react';
import AdminTasksPage from '../../../components/AdminTasksPage';
import AdminLayout from '@/admin/AdminLayout';

const AdminTaskPage = () => {
    return (
        <AdminLayout>
            <AdminTasksPage />
        </AdminLayout>
    );
};

export default AdminTaskPage;