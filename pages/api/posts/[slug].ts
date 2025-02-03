import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.slug) {
            // Fetch the blog post
            const { data: postData, error: postError } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", req.query.slug)
                .single();

            if (postError) return res.status(404).json({ error: "Post not found" });

            // Fetch the client's URL and template HTML from the new API endpoint
            const clientResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchpost/${postData.user_id}?template=${postData.template}`);
            const clientData = await clientResponse.json();

            if (!clientResponse.ok) {
                console.error("Error fetching client URL and template:", clientData.error);
                return res.status(404).json({ error: "Client URL or template not found" });
            }

            const templateHtml = clientData.templateHtml;

            // Ensure the response matches the expected structure
            const response = {
                id: postData.id,
                title: postData.title,
                content: postData.content,
                content_html: postData.content_html,
                status: postData.status,
                template: postData.template,
                created_at: postData.created_at,
                scheduled_publish_date: postData.scheduled_publish_date,
                featured_image: postData.featured_image,
                slug: postData.slug,
                user_id: postData.user_id,
                templateHtml: templateHtml
            };

            return res.status(200).json(response);
        }

        // Fetch all published blog posts
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("status", "published");

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}