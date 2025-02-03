import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import { fetchTemplateHtml } from "@lib/fetchTemplateHtml";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.slug) {
            // Fetch the blog post
            const { data: postData, error: postError } = await supabase
                .from("blog_posts")
                .select("id, title, content, content_html, status, template, created_at, scheduled_publish_date, featured_image, slug, user_id")
                .eq("slug", req.query.slug)
                .single();

            if (postError) return res.status(404).json({ error: "Post not found" });

            // Fetch the client's URL from the organization_members table
            const { data: clientData, error: clientError } = await supabase
                .from("organization_members")
                .select("website_url")
                .eq("user_id", postData.user_id)
                .single();

            if (clientError) return res.status(404).json({ error: "Client URL not found" });

            // Construct the template URL
            const templateUrl = `${clientData.website_url}/templates/${postData.template}.html`;
            const templateHtml = await fetchTemplateHtml(templateUrl);

            return res.status(200).json({ ...postData, templateHtml });
        }

        // Fetch all published blog posts
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, title, content, content_html, status, template, created_at, scheduled_publish_date, featured_image, slug, user_id")
            .eq("status", "published");

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}