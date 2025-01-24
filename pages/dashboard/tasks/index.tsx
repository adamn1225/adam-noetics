'use client';

import React, { useState, useEffect } from 'react';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const AdminDashboardPage = () => {
    const session = useSession();
    const user = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const userId = user.id;
            console.log('User ID:', userId);

            // Fetch the user's profile using user_id
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError.message);
                return;
            }

            console.log('Fetched profile data:', profileData);
            setProfile(profileData || null);
        };

        fetchProfile();
    }, [user]);

    return (
        <>
            <h1>Welcome {profile ? profile.name : 'Admin'}</h1>
        </>
    );
};

export default AdminDashboardPage;