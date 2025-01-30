import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import SMMCalendar from "@components/SMMCalendar";
import DashboardLayout from '../UserLayout';

const { Option } = Select;

const CMS = () => {
    return (
        <DashboardLayout>
            <SMMCalendar />
        </DashboardLayout>
    );
};

export default CMS;