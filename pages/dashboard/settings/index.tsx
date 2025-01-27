'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import DashboardLayout from '../UserLayout';

const SettingsPage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [teamMembers, setTeamMembers] = useState<{ email: string; name: string }[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');

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

                // Fetch team members
                const { data: members, error: membersError } = await supabase
                    .from('organization_members')
                    .select('profiles(email, name)')
                    .eq('organization_id', profile.organization_id);

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

    const handleAddTeamMember = async () => {
        try {
            const { error: inviteError } = await supabase.auth.signInWithOtp({
                email: newMemberEmail,
                options: {
                    emailRedirectTo: 'https://www.noetics.io/setup-password', // Redirect URL to the password setup page
                },
            });

            if (inviteError) throw inviteError;

            // Add the new member to the organization
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw userError || new Error('User not created');

            const { error: memberError } = await supabase
                .from('organization_members')
                .insert([
                    { organization_id: profile.organization_id, user_id: user.id, role: 'member', organization_name: profile.organization_name }
                ]);

            if (memberError) throw memberError;

            setTeamMembers([...teamMembers, { email: newMemberEmail, name: '' }]);
            setNewMemberEmail('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handlePasswordReset = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
                redirectTo: 'https://www.noetics.io/reset-password',
            });
            if (error) throw error;
            alert('Password reset link sent to your email');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmationText !== 'DELETE ACCOUNT') {
            alert('Please type "DELETE ACCOUNT" to confirm.');
            return;
        }

        try {
            const { error } = await supabase.auth.admin.deleteUser(profile.id);
            if (error) throw error;
            alert('Account deleted successfully');
            // Redirect or perform any additional actions after account deletion
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <DashboardLayout>
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
                            <button
                                onClick={handlePasswordReset}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                            >
                                Reset Password
                            </button>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
                            <div className="mt-4 flex gap-2 items-baseline">
                                <label className="block text-lg font-semibold text-gray-800 dark:text-white">Email Notifications</label>
                                <input
                                    type="checkbox"
                                    className="mt-1 dark:text-white"
                                    checked={profile.email_notifications}
                                    onChange={(e) => setProfile({ ...profile, email_notifications: e.target.checked })}
                                />
                            </div>
                            <div className="mt-4 flex gap-2 items-baseline">
                                <label className="block text-sm font-semibold text-gray-800 dark:text-white">SMS Notifications</label>
                                <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={profile.sms_notifications}
                                    onChange={(e) => setProfile({ ...profile, sms_notifications: e.target.checked })}
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-800 dark:text-white">Phone Number</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={profile.phone_number}
                                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-800 dark:text-white">Additional Email</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={profile.additional_email}
                                    onChange={(e) => setProfile({ ...profile, additional_email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-800 dark:text-white">Add Team Member</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    placeholder="team-member@example.com"
                                />
                                <button
                                    onClick={handleAddTeamMember}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                                >
                                    Add Member
                                </button>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Team Members</h3>
                                <ul className="mt-2">
                                    {teamMembers.map((member, index) => (
                                        <li key={index} className="text-sm text-gray-900 dark:text-white">
                                            {member.email} - {member.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Management</h2>
                            <div className="mt-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
                        <p className="mb-4">Please type "DELETE ACCOUNT" to confirm.</p>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SettingsPage;