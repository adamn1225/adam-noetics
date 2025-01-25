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
            <div className="p-8 flex flex-col items-start">
                <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
                <div className="bg-white p-4 rounded-lg shadow w-2/5">
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
                        <label className="block text-sm font-semibold text-gray-700">Name</label>
                        <p className="mt-1 text-gray-900">{profile.name}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{profile.email}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{profile.phone || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                        <p className="mt-1 text-gray-900">{profile.company_name || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold underline">Team Members</h2>
                        <ul className="mt-2">
                            {teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                    <li key={index} className="text-sm text-gray-900">
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

const WrappedUserProfilePage = withAuth(UserProfilePage);
export default WrappedUserProfilePage;