import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import { fetchTemplateHtml } from "@lib/fetchTemplateHtml";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.slug) {
            // Fetch the blog post
            const { data: data, error: error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", req.query.slug)
                .single();

            if (error) return res.status(404).json({ error: "Post not found" });

            // Fetch the client's URL from the organization_members table
            const { data: clientData, error: clientError } = await supabase
                .from("organization_members")
                .select("website_url")
                .eq("user_id", data.user_id)
                .single();

            if (clientError) return res.status(404).json({ error: "Client URL not found" });

            // Ensure the website_url contains https:// or http://
            let websiteUrl = clientData.website_url;

            // Construct the template URL
            const templateUrl = `${websiteUrl}/templates/${data.template}.html`;
            const templateHtml = await fetchTemplateHtml(templateUrl);

            // Ensure the response matches the expected structure
            const response = {
                id: data.id,
                title: data.title,
                content: data.content,
                content_html: data.content_html,
                status: data.status,
                template: data.template,
                created_at: data.created_at,
                scheduled_publish_date: data.scheduled_publish_date,
                featured_image: data.featured_image,
                slug: data.slug,
                user_id: data.user_id,
                templateHtml: templateHtml
            };

            // Trigger Netlify build when publishing
            if (data.status === "published") {
                try {
                    const webhookResponse = await fetch(`${process.env.NEXT_NETLIFY_WEBHOOK}/triggerWebhook`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: data.status }),
                    });

                    if (!webhookResponse.ok) {
                        const errorText = await webhookResponse.text();
                        throw new Error(`Failed to trigger Netlify build. Status: ${webhookResponse.status}, Response: ${errorText}`);
                    }

                    console.log("Netlify Build Triggered Successfully!");
                } catch (error) {
                    console.error("Failed to trigger Netlify build:", error);
                }
            }

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