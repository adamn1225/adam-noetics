import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import { fetchTemplateHtml } from "@lib/fetchTemplateHtml";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { title, content, content_html, template, featured_image, user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id parameter" });
        }

        // Fetch the client's URL from the organization_members table
        const { data: clientData, error: clientError } = await supabase
            .from("organization_members")
            .select("website_url")
            .eq("user_id", user_id)
            .single();

        if (clientError) {
            console.error("Error fetching client URL:", clientError);
            return res.status(404).json({ error: "Client URL not found" });
        }

        // Ensure the website_url contains https:// or http://
        let websiteUrl = clientData.website_url;
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            websiteUrl = `https://${websiteUrl}`;
        }

        // Construct the template URL
        const templateUrl = `${websiteUrl}/templates/${template}.html`;
        const templateHtml = await fetchTemplateHtml(templateUrl);

        // Replace placeholders in the template HTML with actual content
        const previewHtml = templateHtml
            .replace("{{title}}", title)
            .replace("{{content}}", content_html || content)
            .replace("{{featured_image}}", featured_image || "");

        return res.status(200).json({ previewHtml });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}