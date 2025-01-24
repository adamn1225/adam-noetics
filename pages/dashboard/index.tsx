'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import withAuth from '@utils/withAuth';
import DashboardLayout from './UserLayout';

const DashboardPage = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [tasksInProgress, setTasksInProgress] = useState(0);
    const [tasksPending, setTasksPending] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [filesUploaded, setFilesUploaded] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the current user
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    throw authError;
                }

                const userId = authData?.user?.id;
                if (!userId) {
                    throw new Error('User ID not found');
                }

                // Fetch user profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('name')
                    .eq('user_id', userId)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                setUserName(profileData?.name || 'User');

                // Fetch tasks in progress
                const { count: tasksInProgressCount, error: tasksInProgressError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'In Progress');

                if (tasksInProgressError) {
                    throw tasksInProgressError;
                }

                setTasksInProgress(tasksInProgressCount || 0);

                // Fetch tasks pending
                const { count: tasksPendingCount, error: tasksPendingError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'Pending');

                if (tasksPendingError) {
                    throw tasksPendingError;
                }

                setTasksPending(tasksPendingCount || 0);

                // Fetch tasks completed
                const { count: tasksCompletedCount, error: tasksCompletedError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'Completed');

                if (tasksCompletedError) {
                    throw tasksCompletedError;
                }

                setTasksCompleted(tasksCompletedCount || 0);

                // Fetch files uploaded
                const { count: filesCount, error: filesError } = await supabase
                    .from('files')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId);

                if (filesError) {
                    throw filesError;
                }

                setFilesUploaded(filesCount || 0);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">Welcome {userName} to Your Dashboard</h1>
            <p className="text-gray-700">
                Here you can manage your tasks, upload files, and track the progress of your projects.
            </p>

            {/* Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold">Tasks</h2>
                    <p className="text-sm text-gray-600">
                        <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                        {tasksInProgress} tasks in progress
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="inline-block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
                        {tasksPending} tasks pending
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                        {tasksCompleted} tasks completed
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold">Files</h2>
                    <p className="text-sm text-gray-600">{filesUploaded} files uploaded</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white w-2/3 h-96 p-4 rounded-lg shadow mt-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-200 opacity-50 flex items-center justify-center">
                    <p className="text-gray-900 font-semibold">Integrate your analytic tools to see your data here</p>
                </div>
                <div className="opacity-25">
                    {/* Placeholder for the empty graph */}
                    <svg className="w-full h-64" viewBox="0 0 100 100">
                        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
                        <polyline points="10,90 30,70 50,80 70,50 90,60" fill="none" stroke="currentColor" strokeWidth="2" />
                        <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" />
                        <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </DashboardLayout>
    );
};

const WrappedDashboardPage = withAuth(DashboardPage);
export default WrappedDashboardPage;