'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import withAuth from '@utils/withAuth';
import Image from 'next/image';
import DashboardLayout from '../UserLayout';
import placeholderAvatar from '@public/placeholder-avatar.png'; // Import the placeholder image

const UserProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<{ email: string; name: string }[]>([]);

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

                // Fetch team members
                const { data: members, error: membersError } = await supabase
                    .from('organization_members')
                    .select('profiles(email, name)')
                    .eq('organization_id', profileData.organization_id);

                if (membersError) throw membersError;

                setTeamMembers(members.map((member: any) => member.profiles));
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
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get the public URL of the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // Update profile with the new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image: publicUrl })
                .eq('user_id', profile.user_id);

            if (updateError) {
                throw updateError;
            }

            setAvatarUrl(publicUrl);
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
            <div className="p-8 flex flex-col items-start">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">Your Profile</h1>
                <div className="bg-white w-fit dark:text-gray-200 dark:bg-gray-600 p-4 rounded-lg shadow md:w-2/5">
                    <div className="flex items-center mb-4">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                width={96}
                                height={96}
                                className="rounded-full mr-4"
                            />
                        ) : (
                            <Image
                                src={placeholderAvatar}
                                alt="Placeholder Avatar"
                                width={96}
                                height={96}
                                className="rounded-full mr-4"
                            />
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Avatar</label>
                            <div className="relative mt-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Upload Photo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Name</label>
                        <p className="mt-1 text-gray-900 dark:text-gray-50">{profile.name}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
                        <p className="mt-1 text-gray-900 dark:text-gray-50">{profile.email}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</label>
                        <p className="mt-1 text-gray-900 dark:text-gray-50">{profile.phone || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Company Name</label>
                        <p className="mt-1 text-gray-900 dark:text-gray-50">{profile.company_name || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold underline text-gray-900 dark:text-gray-50">Team Members</h2>
                        <ul className="mt-2">
                            {teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                    <li key={index} className="text-sm text-gray-900 dark:text-gray-200">
                                        {member.email} - {member.name}
                                    </li>
                                ))
                            ) : (
                                <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded">
                                    Invite Team Members
                                </button>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

UserProfilePage.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default UserProfilePage;