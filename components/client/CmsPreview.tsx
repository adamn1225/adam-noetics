import React from 'react';
import TemplateLoader from './TemplateLoader';

interface PreviewProps {
    title: string;
    content: string;
    template: string;
    featured_image?: string;
}

const CmsPreview: React.FC<PreviewProps> = ({ title, content, template, featured_image }) => {
    return (
        <div className="preview-container">
            <TemplateLoader title={title} content={content} template={template} featured_image={featured_image} />
        </div>
    );
};

export default CmsPreview;