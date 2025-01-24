'use client';

import React, { useState } from 'react';
import AdminLayout from '../../AdminLayout';

const AdminAnalyticsPage = () => {
    const [googleAnalyticsKey, setGoogleAnalyticsKey] = useState('');
    const [semrushKey, setSemrushKey] = useState('');
    const [ahrefsKey, setAhrefsKey] = useState('');
    const [message, setMessage] = useState('');

    const handleGoogleAnalyticsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle Google Analytics integration logic here
        setMessage('Google Analytics integrated successfully!');
    };

    const handleSemrushSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle SEMrush integration logic here
        setMessage('SEMrush integrated successfully!');
    };

    const handleAhrefsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle Ahrefs integration logic here
        setMessage('Ahrefs integrated successfully!');
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Analytics Integration</h1>
                {message && <div className="mb-4 text-green-500">{message}</div>}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Google Analytics</h2>
                    <form onSubmit={handleGoogleAnalyticsSubmit}>
                        <label htmlFor="googleAnalyticsKey" className="block text-sm font-medium text-gray-700">
                            Google Analytics API Key
                        </label>
                        <input
                            type="text"
                            id="googleAnalyticsKey"
                            value={googleAnalyticsKey}
                            onChange={(e) => setGoogleAnalyticsKey(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your Google Analytics API Key"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Integrate Google Analytics
                        </button>
                    </form>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">SEMrush</h2>
                    <form onSubmit={handleSemrushSubmit}>
                        <label htmlFor="semrushKey" className="block text-sm font-medium text-gray-700">
                            SEMrush API Key
                        </label>
                        <input
                            type="text"
                            id="semrushKey"
                            value={semrushKey}
                            onChange={(e) => setSemrushKey(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your SEMrush API Key"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Integrate SEMrush
                        </button>
                    </form>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Ahrefs</h2>
                    <form onSubmit={handleAhrefsSubmit}>
                        <label htmlFor="ahrefsKey" className="block text-sm font-medium text-gray-700">
                            Ahrefs API Key
                        </label>
                        <input
                            type="text"
                            id="ahrefsKey"
                            value={ahrefsKey}
                            onChange={(e) => setAhrefsKey(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your Ahrefs API Key"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Integrate Ahrefs
                        </button>
                    </form>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Moz (Coming Soon)</h2>
                    <p className="text-gray-600">Integration with Moz will be available soon.</p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Hotjar (Coming Soon)</h2>
                    <p className="text-gray-600">Integration with Hotjar will be available soon.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalyticsPage;