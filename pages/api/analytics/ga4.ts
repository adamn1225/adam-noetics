import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { supabase } from '@lib/supabaseClient';

const analytics = google.analyticsdata('v1beta');

async function getGA4Data(userId: string) {
    // Fetch the user's Google Analytics API key from the database
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('google_analytics_key')
        .eq('user_id', userId)
        .single();

    if (profileError || !profile) {
        throw new Error('Failed to fetch Google Analytics key');
    }

    const googleAnalyticsKey = profile.google_analytics_key;

    // Use the API key to authenticate and fetch data
    google.options({
        auth: googleAnalyticsKey,
    });

    const response = await analytics.properties.runReport({
        property: `properties/YOUR_PROPERTY_ID`,
        requestBody: {
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'activeUsers' }],
            dateRanges: [{ startDate: '2023-01-01', endDate: '2023-01-31' }],
        },
    });

    return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = req.query.userId as string;

        try {
            const data = await getGA4Data(userId);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}