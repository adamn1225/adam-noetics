'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import DashboardLayout from '../UserLayout';

type Task = Database['public']['Tables']['tasks']['Row'];

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
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
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                if (!profileData.organization_id) {
                    throw new Error('Organization ID not found for user');
                }

                setProfile(profileData);

                // Fetch tasks for the organization
                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('organization_id', profileData.organization_id)
                    .order('created_at', { ascending: false });

                if (tasksError) {
                    throw tasksError;
                }

                setTasks(tasksData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

        const taskSubscription = supabase
            .channel('public:tasks')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, payload => {
                const newTask: Task = payload.new as Task;
                setTasks(prevTasks => [newTask, ...prevTasks]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(taskSubscription);
        };
    }, []);

    const handleAddNote = async (taskId: number) => {
        if (!newNote.trim()) return;

        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ notes: newNote })
                .eq('id', taskId);

            if (error) {
                throw error;
            }

            setTasks(tasks.map(task => task.id === taskId ? { ...task, notes: newNote } : task));
            setNewNote('');
            setSelectedTaskId(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleTaskRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskTitle.trim() || !taskDescription.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title: taskTitle, description: taskDescription, due_date: taskDueDate, is_request: true, status: 'Pending', organization_id: profile.organization_id }]);

            if (error) {
                throw error;
            }

            setTaskTitle('');
            setTaskDescription('');
            setTaskDueDate('');
            setError(null);
            setIsModalOpen(false);
            alert('Task request submitted successfully.');
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const projectTasks = tasks.filter(task => !task.is_request);
    const taskRequests = tasks.filter(task => task.is_request);

    return (
        <DashboardLayout>
            <div className='px-4 py-6 md:px-8 md:py-12'>
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Project Tasks</h1>
                <div className='container mx-auto'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Title</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Description</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Status</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Due Date</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Notes</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y border border-gray-200 divide-gray-200">
                                {projectTasks.map((task) => (
                                    <tr key={task.id} className="divide-x divide-gray-200">
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.title}</td>
                                        <td className="py-2 px-4 text-center">{task.description}</td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.status}</td>
                                        <td className="py-2 px-4 text-center">{task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'}</td>
                                        <td className="py-2 px-4 text-center">{task.notes}</td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedTaskId(task.id)}
                                                className="bg-blue-600 text-white py-1 px-2 rounded"
                                            >
                                                Add Note
                                            </button>
                                            {selectedTaskId === task.id && (
                                                <div className="mt-4">
                                                    <textarea
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        placeholder="Add a note"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => handleAddNote(task.id)}
                                                        className="bg-green-600 text-white py-1 px-2 rounded mt-2"
                                                    >
                                                        Save Note
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">Request a Task</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Request a Task
                </button>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
                            <h2 className="text-xl font-bold mb-4">Request a Task</h2>
                            <form onSubmit={handleTaskRequest} className="flex flex-col gap-6">
                                <div className="mb-4 flex flex-col gap-1">
                                    <label className="block text-sm font-medium text-gray-700">Task title
                                        <input
                                            type="text"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        /></label>
                                    <label className="block text-sm font-medium text-gray-700">Description
                                        <textarea
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        /></label>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Requested Due Date</label>
                                    <input
                                        type="datetime-local"
                                        value={taskDueDate}
                                        onChange={(e) => setTaskDueDate(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-600 text-white py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded"
                                    >
                                        Submit Task Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Requested Tasks</h2>
                    <div className='container mx-auto'>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 bg-white divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Title</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Description</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Requested Due Date</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y border border-gray-200 divide-gray-200">
                                    {taskRequests.map((taskRequest) => (
                                        <tr key={taskRequest.id} className="divide-x divide-gray-200">
                                            <td className="py-2 px-4 whitespace-nowrap text-center">{taskRequest.title}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.description}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.due_date ? new Date(taskRequest.due_date).toLocaleString() : 'No due date'}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.status || 'Pending'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
};

export default TasksPage;