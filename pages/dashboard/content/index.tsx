import React from "react";
import DashboardLayout from "../UserLayout";
import SmmCards from "../../components/SmmCards";

const PageBuilder = () => {
    return (
        <DashboardLayout>
            <SmmCards />
        </DashboardLayout>
    );
}

export default PageBuilder;