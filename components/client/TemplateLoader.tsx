import React from 'react';

interface TemplateLoaderProps {
    title: string;
    content: string;
    content_html?: string;
    template: string;
    featured_image?: string;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ title, content, content_html, template, featured_image }) => {
    return (
        <div className="template-loader">
            {featured_image && (
                <div className="featured-image-container">
                    <img src={featured_image} alt="Featured" className="featured-image" />
                </div>
            )}
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content_html || content }} />
        </div>
    );
};

export default TemplateLoader;