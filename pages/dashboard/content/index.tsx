import { useRouter } from 'next/router';
import CraftEditor from "@components/pagebuilder/CraftEditor";
import React from "react";
import DashboardLayout from "../UserLayout";

const PageBuilder = () => {

    return (
        <DashboardLayout>
            <div className="w-full h-screen">
                <CraftEditor />
            </div>
        </DashboardLayout>
    );
}

export default PageBuilder;