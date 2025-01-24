'use client';

import React, { useState } from 'react';
import { Home, FileText, ClipboardList, BarChart, User, LogOut, List, UserPlus } from "lucide-react";
import { supabase } from "@lib/supabaseClient";
import { useRouter } from "next/navigation";

const adminNavItems = [
    { name: "Dashboard", href: "/admin/clients/admindash", icon: Home },
    { name: "Admin Tasks", href: "/admin/clients/tasks/", icon: List },
    { name: "Client Files", href: "/admin/clients/clientfiles/", icon: ClipboardList },
    // { name: "Reports", href: "/admin/clients/reports/", icon: FileText },
    { name: "Analytics", href: "/admin/clients/analytics/", icon: BarChart },
    { name: "Users", href: "/admin/clients/users/", icon: User },
    { name: "Onboard Clients", href: "/admin/clients/onboard/", icon: UserPlus },
];

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("/login");
        } else {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <aside
            className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-56"
                }`}
        >
            <div className="flex items-center justify-between p-4">
                <h2
                    className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
                        }`}
                >
                    Admin Dashboard
                </h2>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white focus:outline-none"
                >
                    {isCollapsed ? ">" : "<"}
                </button>
            </div>
            <nav className="mt-4">
                <ul>
                    {adminNavItems.map((item) => (
                        <li key={item.name} className="mb-2">
                            <a
                                href={item.href}
                                className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded"
                            >
                                <item.icon className="mr-2" />
                                <span className={`${isCollapsed ? "hidden" : "block"}`}>{item.name}</span>
                            </a>
                        </li>
                    ))}
                    <li className="mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center p-2 text-sm font-medium hover:bg-gray-700 rounded w-full text-left"
                        >
                            <LogOut className="mr-2" />
                            <span className={`${isCollapsed ? "hidden" : "block"}`}>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;