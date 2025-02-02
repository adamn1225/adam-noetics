import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.slug) {
            // Fetch a single blog post by slug
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", req.query.slug)
                .single();

            if (error || !data) return res.status(404).json({ error: "Post not found" });

            return res.status(200).json(data);
        }

        // Fetch all published blog posts
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, title, slug, excerpt, featured_image, published_at")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
