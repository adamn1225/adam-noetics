'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import withAuth from '@utils/withAuth';
import Image from 'next/image';
import DashboardLayout from '../UserLayout';

const UserProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
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

                setProfile(profileData);
                setAvatarUrl(profileData?.profile_image || null);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            setLoading(true);

            // Upload avatar to the bucket
            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Update profile with the new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image: filePath })
                .eq('user_id', profile.user_id);

            if (updateError) {
                throw updateError;
            }

            setAvatarUrl(filePath);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
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
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-4">
                    {avatarUrl ? (
                        <Image
                            src={`${supabase.storage.from('profile-pictures').getPublicUrl(avatarUrl).data.publicUrl}`}
                            alt="Avatar"
                            width={96}
                            height={96}
                            className="rounded-full mr-4"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                            <span className="text-gray-500">No Avatar</span>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{profile.phone || 'N/A'}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-gray-900">{profile.company_name || 'N/A'}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-gray-900">{profile.role || 'N/A'}</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

const WrappedUserProfilePage = withAuth(UserProfilePage);
export default WrappedUserProfilePage;