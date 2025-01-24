'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import DashboardLayout from '../UserLayout';

type Task = Database['public']['Tables']['tasks']['Row'];

const ClientTasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('*')
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Client Tasks</h1>
                <div className='container mx-auto'>
                    <table className="min-w-full bg-white divide-y divide-gray-200">
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
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map((task) => (
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
        </DashboardLayout>
    );
};

export default ClientTasksPage;