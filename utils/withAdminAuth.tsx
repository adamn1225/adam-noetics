'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';

const withAdminAuth = (Component: React.ComponentType) => {
    const AdminAuthWrapper = (props: any) => {
        const [loading, setLoading] = useState(true);
        const [isAdmin, setIsAdmin] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const checkAdminRole = async () => {
                const { data: user } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user?.user?.id)
                        .single();

                    if (profile?.role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        router.push('/'); // Redirect to home or login if not admin
                    }
                } else {
                    router.push('/login'); // Redirect to login if not authenticated
                }
                setLoading(false);
            };

            checkAdminRole();
        }, [router]);

        if (loading) {
            return <p>Loading...</p>; // Or a loading spinner
        }

        return isAdmin ? <Component {...props} /> : null;
    };

    return AdminAuthWrapper;
};

export default withAdminAuth;
