import React from 'react';
import CmsDashboard from '@components/CmsDashboard';
import DashboardLayout from '../UserLayout';

const ContentPage = () => {
    return (
        <DashboardLayout>
            <CmsDashboard />
        </DashboardLayout>
    );
};

export default ContentPage;