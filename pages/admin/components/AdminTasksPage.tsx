'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import AdminLayout from '../AdminLayout';

type Task = Database['public']['Tables']['tasks']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const AdminTasksPage = () => {
    const [clients, setClients] = useState<Profile[]>([]);
    const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('Pending');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
    const [editingTaskDescription, setEditingTaskDescription] = useState<string>('');
    const [editingTaskStatus, setEditingTaskStatus] = useState<string>('');
    const [editingTaskDueDate, setEditingTaskDueDate] = useState<string>('');
    const [editingTaskNotes, setEditingTaskNotes] = useState<string>('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Fetch clients
                const { data: clientsData, error: clientsError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'client');

                if (clientsError) {
                    throw new Error('Failed to fetch clients');
                }

                setClients(clientsData || []);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedClient) return;

            try {
                // Fetch tasks for the selected client
                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', selectedClient.id);

                if (tasksError) {
                    throw new Error('Failed to fetch tasks');
                }

                setTasks(tasksData || []);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('An unknown error occurred');
                }
            }
        };

        fetchTasks();
    }, [selectedClient]);

    const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const client = clients.find(c => c.id === event.target.value) || null;
        setSelectedClient(client);
    };

    const handleAddTask = async () => {
        if (!selectedClient || newTaskTitle.trim() === '') return;

        const { data, error } = await supabase.from('tasks').insert([
            {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                due_date: newTaskDueDate,
                user_id: selectedClient.id,
            },
        ]);

        if (!error) {
            setTasks((prev) => [...prev, ...(data || [])]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('Pending');
            setNewTaskDueDate('');
        } else {
            console.error('Error adding task:', error.message);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (!error) {
            setTasks((prev) => prev.filter(task => task.id !== Number(taskId)));
        } else {
            console.error('Error deleting task:', error.message);
        }
    };

    const handleUpdateTask = async (taskId: string) => {
        setEditingTaskId(taskId);
        const task = tasks.find(task => task.id === Number(taskId));
        if (task) {
            setEditingTaskTitle(task.title);
            setEditingTaskDescription(task.description || '');
            setEditingTaskStatus(task.status || '');
            setEditingTaskDueDate(task.due_date || '');
            setEditingTaskNotes(task.notes || '');
        }
    };

    const handleSaveTask = async (taskId: string) => {
        const { error } = await supabase.from('tasks').update({
            title: editingTaskTitle,
            description: editingTaskDescription,
            status: editingTaskStatus,
            due_date: editingTaskDueDate,
            notes: editingTaskNotes,
        }).eq('id', taskId);
        if (!error) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === Number(taskId) ? {
                        ...task,
                        title: editingTaskTitle,
                        description: editingTaskDescription,
                        status: editingTaskStatus,
                        due_date: editingTaskDueDate,
                        notes: editingTaskNotes,
                    } : task
                )
            );
            setEditingTaskId(null);
        } else {
            console.error('Error updating task:', error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Admin Tasks</h1>
                <div className="mb-4">
                    <label htmlFor="client-select" className="block text-sm font-medium text-gray-700">
                        Select Client
                    </label>
                    <select
                        id="client-select"
                        value={selectedClient?.id || ''}
                        onChange={handleClientChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedClient && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">Add New Task</h2>
                        <div className="mb-4 flex flex-col justify-start gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Task title"
                                className="p-2 border border-gray-300 rounded mr-2"
                            />
                            <textarea
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="Task description"
                                className="p-2 border border-gray-300 rounded mr-2"
                            />
                            <select
                                value={newTaskStatus}
                                onChange={(e) => setNewTaskStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded mr-2"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Issue">Issue</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <input
                                type="datetime-local"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="p-2 border border-gray-300 rounded mr-2"
                            />
                            <button
                                onClick={handleAddTask}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                )}
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
                                    <td className="py-2 px-4 whitespace-nowrap text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <input
                                                type="text"
                                                value={editingTaskTitle}
                                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                                className="p-2 border border-gray-300 rounded mr-2"
                                            />
                                        ) : (
                                            task.title
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <textarea
                                                value={editingTaskDescription}
                                                onChange={(e) => setEditingTaskDescription(e.target.value)}
                                                className="p-2 border border-gray-300 rounded mr-2"
                                            />
                                        ) : (
                                            task.description
                                        )}
                                    </td>
                                    <td className="py-2 px-4 whitespace-nowrap text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <select
                                                value={editingTaskStatus}
                                                onChange={(e) => setEditingTaskStatus(e.target.value)}
                                                className="p-2 border border-gray-300 rounded mr-2"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Issue">Issue</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        ) : (
                                            task.status
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <input
                                                type="datetime-local"
                                                value={editingTaskDueDate}
                                                onChange={(e) => setEditingTaskDueDate(e.target.value)}
                                                className="p-2 border border-gray-300 rounded mr-2"
                                            />
                                        ) : (
                                            task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <textarea
                                                value={editingTaskNotes}
                                                onChange={(e) => setEditingTaskNotes(e.target.value)}
                                                className="p-2 border border-gray-300 rounded mr-2"
                                            />
                                        ) : (
                                            task.notes
                                        )}
                                    </td>
                                    <td className="py-2 px-4 whitespace-nowrap text-center">
                                        {editingTaskId === task.id.toString() ? (
                                            <button
                                                onClick={() => handleSaveTask(task.id.toString())}
                                                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdateTask(task.id.toString())}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                            >
                                                Update
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteTask(task.id.toString())}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminTasksPage;