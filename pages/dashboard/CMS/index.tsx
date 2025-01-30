import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import CMSDashboard from "@components/CMSDashboard";
import DashboardLayout from '../UserLayout';

const { Option } = Select;

const CMS = () => {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mt-2 mb-4">Content Management System</h1>
            <CMSDashboard />
        </DashboardLayout>
    );
};

export default CMS;