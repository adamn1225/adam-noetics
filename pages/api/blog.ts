import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role for admin actions
);

// API Route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Fetch all published blog posts
        const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        // Create a new blog post (admin use only)
        const { title, slug, content, author_id } = req.body;
        const { data, error } = await supabase.from('blog_posts').insert([{ title, slug, content, author_id, published: false }]);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
