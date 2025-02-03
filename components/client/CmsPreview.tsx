import React from 'react';

interface PreviewProps {
    title: string;
    content: string;
    template: string;
    featured_image?: string;
}

const CmsPreview: React.FC<PreviewProps> = ({ title, content, template, featured_image }) => {
    return (
        <div className="preview-container">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            {featured_image && <img src={featured_image} alt="Featured" className="mb-4 w-full h-auto object-cover" />}
            <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default CmsPreview;