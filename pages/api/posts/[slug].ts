import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import { fetchTemplateHtml } from "@lib/fetchTemplateHtml";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.slug) {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("id, title, content, content_html, status, template, created_at, scheduled_publish_date, featured_image, slug")
                .eq("slug", req.query.slug)
                .single();

            if (error) return res.status(404).json({ error: "Post not found" });

            // Fetch the template HTML content dynamically
            const templateUrl = `https://your-template-url.com/templates/${data.template}.html`;
            const templateHtml = await fetchTemplateHtml(templateUrl);

            return res.status(200).json({ ...data, templateHtml });
        }

        // Fetch all published blog posts
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, title, content, content_html, status, template, created_at, scheduled_publish_date, featured_image, slug")
            .eq("status", "published");

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}