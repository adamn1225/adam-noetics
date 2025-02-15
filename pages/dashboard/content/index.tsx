import React from "react";
import DashboardLayout from "../UserLayout";
import { Link } from 'react-router-dom';

const PageBuilder = () => {
    return (
        <DashboardLayout>
            <div className="w-full h-screen">
                Sorry - code is still crap/in-development
                {/* <Link to="http://builder.nextnoetics.com">Go to Page Builder</Link> */}

            </div>
        </DashboardLayout>
    );
}

export default PageBuilder;