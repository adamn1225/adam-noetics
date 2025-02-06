'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';

const ClientSettings = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cmsToken, setCmsToken] = useState<string | null>(null);
    const [showToken, setShowToken] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) throw new Error('User not found');

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (profileError) throw profileError;

                setProfile(profile);

                const { data: member, error: memberError } = await supabase
                    .from('organization_members')
                    .select('cms_token, website_url')
                    .eq('user_id', user.id)
                    .single();

                if (memberError) throw memberError;

                setCmsToken(member.cms_token);
                setWebsiteUrl(member.website_url || '');
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleGenerateCmsToken = async () => {
        const newToken = uuidv4();
        setCmsToken(newToken);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('User not authenticated');
            return;
        }

        const { error } = await supabase
            .from('organization_members')
            .update({ cms_token: newToken })
            .eq('user_id', user.id);

        if (error) {
            console.error('Error updating CMS token:', error);
        }

        // Update the profile in the admin view
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ cms_token: newToken })
            .eq('user_id', user.id);

        if (profileError) {
            console.error('Error updating CMS token in profile:', profileError);
        }
    };

    const handleWebsiteUrlChange = async (e) => {
        e.preventDefault();
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }

        const { error } = await supabase
            .from('organization_members')
            .update({ website_url: websiteUrl })
            .eq('user_id', profile.id);

        if (error) {
            console.error('Error updating website URL:', error);
        } else {
            console.log('Website URL updated successfully');
        }
    };

    return (
        <div className="container mx-auto pt-4 pb-8">
            <h1 className="text-3xl font-semibold mt-8 text-gray-900 dark:text-white">Settings</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {profile && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Name</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{profile.name}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Email</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{profile.email}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">CMS Token</label>
                        <div className="flex items-center">
                            <input
                                type={showToken ? 'text' : 'password'}
                                value={cmsToken || ''}
                                readOnly
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <button
                                onClick={() => setShowToken(!showToken)}
                                className="ml-2"
                            >
                                {showToken ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            onClick={handleGenerateCmsToken}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Generate CMS Token
                        </button>
                        <p className='text-zinc-900 dark:text-white italic font-semibold'>This token is meant to go into your environment tables - if you do not know what that is please contact your developer for assistance while we work on our documentation section.</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Website URL</label>
                        <input
                            type="text"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                        <button
                            onClick={handleWebsiteUrlChange}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Website URL
                        </button>
                    </div>
                    {/* <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">User ID</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{profile.user_id}</p>
                    </div> */}
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Website URL</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{websiteUrl || 'No website URL'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSettings;