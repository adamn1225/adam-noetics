"use client";
import React from "react";
import CMSDashboard from "@components/CMSDashboard";
import DashboardLayout from '../UserLayout';


const CMS = () => {
    return (
        <DashboardLayout>
            <CMSDashboard />
        </DashboardLayout>
    );
};

export default CMS;