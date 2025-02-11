"use client";
import React, { useState } from "react";
import ClientCms from "@components/client/cms/ClientCms";
import DashboardLayout from '../UserLayout';

const ClientCmsPage = () => {
    return (
        <DashboardLayout>
            <ClientCms />
        </DashboardLayout>
    );
};

export default ClientCmsPage;