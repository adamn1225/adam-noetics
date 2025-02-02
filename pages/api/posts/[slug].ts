// Noetics API: pages/api/posts/[slug].ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient"; // If using Supabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { slug } = req.query;
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) return res.status(404).json({ error: "Post not found" });

        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
