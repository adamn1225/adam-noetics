'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@lib/supabaseClient';

const ClientAnalytics = () => {
    const [googleAnalyticsKey, setGoogleAnalyticsKey] = useState('');
    const [semrushKey, setSemrushKey] = useState('');
    const [ahrefsKey, setAhrefsKey] = useState('');
    const [message, setMessage] = useState('');
    const [showGoogleAnalyticsKey, setShowGoogleAnalyticsKey] = useState(false);
    const [showSemrushKey, setShowSemrushKey] = useState(false);
    const [showAhrefsKey, setShowAhrefsKey] = useState(false);
    interface GA4Data {
        error?: string;
        [key: string]: any;
    }

    const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('google_analytics_key, semrush_key, ahrefs_key')
                    .eq('user_id', user.id)
                    .single();

                if (profile) {
                    setGoogleAnalyticsKey(profile.google_analytics_key || '');
                    setSemrushKey(profile.semrush_key || '');
                    setAhrefsKey(profile.ahrefs_key || '');
                }

                if (error) {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, []);

    const handleGoogleAnalyticsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ google_analytics_key: googleAnalyticsKey })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating Google Analytics key:', error);
                setMessage('Failed to integrate Google Analytics.');
            } else {
                setMessage('Google Analytics integrated successfully!');
            }
        }
    };

    const handleSemrushSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ semrush_key: semrushKey })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating SEMrush key:', error);
                setMessage('Failed to integrate SEMrush.');
            } else {
                setMessage('SEMrush integrated successfully!');
            }
        }
    };

    const handleAhrefsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ ahrefs_key: ahrefsKey })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating Ahrefs key:', error);
                setMessage('Failed to integrate Ahrefs.');
            } else {
                setMessage('Ahrefs integrated successfully!');
            }
        }
    };

    const fetchGA4Data = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const response = await fetch(`/api/analytics/ga4?userId=${user.id}`);
            const data = await response.json();
            setGa4Data(data);
        }
    };

    useEffect(() => {
        fetchGA4Data();
    }, []);

    return (
        <>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Analytics Integration</h1>
                {message && <div className="mb-4 text-green-500">{message}</div>}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold dark:text-gray-100">Google Analytics</h2>
                    <p className="text-gray-600 mb-4 dark:text-gray-200">To integrate to any of your analytic tools, enter your API Key below. Don&apos;t have any analytic tools or not sure where to find your API Key? <a className="font-semibold text-blue-600 underline hover:text-blue-500" href="#" >Speak with a support agent</a></p>
                    <form onSubmit={handleGoogleAnalyticsSubmit}>
                        <label htmlFor="googleAnalyticsKey" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Google Analytics API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showGoogleAnalyticsKey ? 'text' : 'password'}
                                id="googleAnalyticsKey"
                                value={googleAnalyticsKey}
                                onChange={(e) => setGoogleAnalyticsKey(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Your GA4 API Key"
                            />
                            <button
                                type="button"
                                onClick={() => setShowGoogleAnalyticsKey(!showGoogleAnalyticsKey)}
                                className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                            >
                                {showGoogleAnalyticsKey ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-nowrap text-sm md:text-normal hover:bg-blue-600 text-white font-bold py-2 px-4 rounded dark:text-gray-50"
                        >
                            Integrate Google Analytics
                        </button>
                    </form>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">SEMrush</h2>
                    <form onSubmit={handleSemrushSubmit}>
                        <label htmlFor="semrushKey" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            SEMrush API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showSemrushKey ? 'text' : 'password'}
                                id="semrushKey"
                                value={semrushKey}
                                onChange={(e) => setSemrushKey(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Your SEMrush API Key"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSemrushKey(!showSemrushKey)}
                                className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                            >
                                {showSemrushKey ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 text-sm md:text-normal bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded "
                        >
                            Integrate SEMrush
                        </button>
                    </form>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Ahrefs</h2>
                    <form onSubmit={handleAhrefsSubmit}>
                        <label htmlFor="ahrefsKey" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Ahrefs API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showAhrefsKey ? 'text' : 'password'}
                                id="ahrefsKey"
                                value={ahrefsKey}
                                onChange={(e) => setAhrefsKey(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Your Ahrefs API Key"
                            />
                            <button
                                type="button"
                                onClick={() => setShowAhrefsKey(!showAhrefsKey)}
                                className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                            >
                                {showAhrefsKey ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 text-sm md:text-normal bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Integrate Ahrefs
                        </button>
                    </form>
                </div>
                <div className="mb-8 dark:text-gray-100">
                    <h2 className="text-xl font-semibold mb-2">Moz (Coming Soon)</h2>
                    <p className="text-gray-600 dark:text-gray-200">Integration with Moz will be available soon.</p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Hotjar (Coming Soon)</h2>
                    <p className="text-gray-600 dark:text-gray-200">Integration with Hotjar will be available soon.</p>
                </div>
                {ga4Data && !ga4Data.error && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Google Analytics Data</h2>
                        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(ga4Data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </ >
    );
};

export default ClientAnalytics;