'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import AdminLayout from '../../AdminLayout';
import AdminClientPost from '@components/AdminClientPost';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';

interface Profile {
    id: string;
    name: string;
    email: string;
    organization_id: string | null;
    profile_image: string | null;
    user_id: string | null;
    cms_enabled: boolean;
}

interface OrganizationMember {
    user_id: string;
    organization_id: string;
    cms_token: string | null;
    role: string;
    created_at: string | null;
    organization_name: string | null;
}

const AdminClientCMS = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [organizationMember, setOrganizationMember] = useState<OrganizationMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*');

                if (profilesError) {
                    throw new Error('Failed to fetch profiles');
                }

                setProfiles(profilesData || []);
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

        fetchProfiles();
    }, []);

    useEffect(() => {
        const fetchOrganizationMember = async () => {
            if (!selectedProfile) return;

            const { data: organizationMemberData, error: organizationMemberError } = await supabase
                .from('organization_members')
                .select('*')
                .eq('user_id', selectedProfile.id) // Use the profile ID
                .eq('organization_id', selectedProfile.organization_id) // Ensure the organization ID matches
                .single();

            if (organizationMemberError) {
                console.error('Failed to fetch organization member', organizationMemberError);
                return;
            }

            setOrganizationMember(organizationMemberData);
        };

        fetchOrganizationMember();
    }, [selectedProfile]);

    const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const profile = profiles.find(p => p.id === event.target.value) || null;
        setSelectedProfile(profile);
    };

    const toggleCMSEnabled = async () => {
        if (!selectedProfile) return;

        const updatedProfile = { ...selectedProfile, cms_enabled: !selectedProfile.cms_enabled };
        const { error } = await supabase
            .from('profiles')
            .update({ cms_enabled: updatedProfile.cms_enabled })
            .eq('id', selectedProfile.id);

        if (error) {
            console.error('Error updating CMS status:', error);
        } else {
            setSelectedProfile(updatedProfile);
            setProfiles(profiles.map(p => (p.id === updatedProfile.id ? updatedProfile : p)));
        }
    };

    const handleGenerateCmsToken = async () => {
        if (!selectedProfile || !organizationMember) return;

        const newToken = uuidv4();
        const updatedOrganizationMember = { ...organizationMember, cms_token: newToken };

        const { error } = await supabase
            .from('organization_members')
            .update({ cms_token: newToken })
            .eq('user_id', organizationMember.user_id)
            .eq('organization_id', organizationMember.organization_id);

        if (error) {
            console.error('Error updating CMS token:', error);
        } else {
            setOrganizationMember(updatedOrganizationMember);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Admin Client CMS</h2>
                <div className="mb-4">
                    <label htmlFor="profile-select" className="block text-sm font-medium text-gray-700">
                        Select User Profile
                    </label>
                    <select
                        id="profile-select"
                        value={selectedProfile?.id || ''}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Select a user profile</option>
                        {profiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                                {profile.name} ({profile.email})
                            </option>
                        ))}
                    </select>
                </div>
                {selectedProfile && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">User CMS Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-gray-900">{selectedProfile.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-gray-900">{selectedProfile.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Organization ID</label>
                                <p className="mt-1 text-gray-900">{selectedProfile.organization_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                                {selectedProfile.profile_image ? (
                                    <img src={selectedProfile.profile_image} alt="Profile" className="mt-2 h-32 w-32 object-cover" />
                                ) : (
                                    <p className="mt-1 text-gray-900">No profile image</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User ID</label>
                                <p className="mt-1 text-gray-900">{selectedProfile.user_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CMS Enabled</label>
                                <button
                                    onClick={toggleCMSEnabled}
                                    className={`mt-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${selectedProfile.cms_enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {selectedProfile.cms_enabled ? 'Disable CMS' : 'Enable CMS'}
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CMS Token</label>
                                <div className="flex items-center">
                                    <input
                                        type={showToken ? 'text' : 'password'}
                                        value={organizationMember?.cms_token || ''}
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
                                    className="mt-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                >
                                    Generate CMS Token
                                </button>
                            </div>
                        </div>
                        <AdminClientPost userId={selectedProfile.id} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminClientCMS;