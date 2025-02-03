import React, { useEffect, useState } from 'react';

interface TemplateLoaderProps {
    title: string;
    content: string;
    content_html?: string;
    template: string;
    featured_image?: string;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ title, content, content_html, template, featured_image }) => {
    const [templateHtml, setTemplateHtml] = useState<string | null>(null);
    const [templateCss, setTemplateCss] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                // Fetch the template HTML and CSS from the Astro project
                const htmlResponse = await fetch(`/templates/${template}.html`);
                const cssResponse = await fetch(`/templates/${template}.css`);

                const html = await htmlResponse.text();
                const css = await cssResponse.text();

                setTemplateHtml(html);
                setTemplateCss(css);
            } catch (error) {
                console.error('Error fetching template:', error);
            }
        };

        fetchTemplate();
    }, [template]);

    if (!templateHtml || !templateCss) {
        return <div>Loading template...</div>;
    }

    return (
        <div className="template-preview">
            <style>{templateCss}</style>
            <div dangerouslySetInnerHTML={{ __html: content_html || content }} />
        </div>
    );
};

export default TemplateLoader;