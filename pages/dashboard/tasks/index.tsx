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
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');

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
                .insert([{ title: taskTitle, description: taskDescription, due_date: taskDueDate, is_request: true, status: 'Pending' }]);

            if (error) {
                throw error;
            }

            setTaskTitle('');
            setTaskDescription('');
            setTaskDueDate('');
            setError(null);
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
            <div className='px-8 py-12'>
                <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>
                <div className='container mx-auto'>
                    <table className="min-w-full  border border-gray-200 bg-white divide-y divide-gray-200">
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
                <h2 className="text-2xl font-bold mt-8 mb-4">Request a Task</h2>
                <div className="container mx-auto">
                    <form onSubmit={handleTaskRequest} className="bg-white flex gap-6 justify-stretch items-center p-4 rounded-lg shadow w-1/2">
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
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded text-nowrap"
                        >
                            Submit Task Request
                        </button>
                    </form>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Requested Tasks</h2>
                    <div className='container mx-auto'>
                        <table className="min-w-full  border border-gray-200 bg-white divide-y divide-gray-200">
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
        </DashboardLayout>
    );
};

export default ClientTasksPage;