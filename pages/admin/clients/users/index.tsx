'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import AdminLayout from '../../AdminLayout';

type Profile = Database['public']['Tables']['profiles']['Row'];

const AdminClientsPage = () => {
    const [clients, setClients] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'client');

                if (error) {
                    throw error;
                }

                setClients(data || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Client Profiles</h1>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Company</th>
                            <th className="py-2 px-4 border-b">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="py-2 px-4 border-b text-center">{client.name}</td>
                                <td className="py-2 px-4 border-b text-center">{client.email}</td>
                                <td className="py-2 px-4 border-b text-center">{client.phone}</td>
                                <td className="py-2 px-4 border-b text-center">{client.company_name}</td>
                                <td className="py-2 px-4 border-b text-center">{client.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminClientsPage;