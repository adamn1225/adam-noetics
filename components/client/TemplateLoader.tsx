import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import BasicTemplate from './templates/BasicTemplate';
import ModernTemplate from './templates/ModernTemplate';

interface TemplateLoaderProps {
    title: string;
    content: string;
    template: string;
    featured_image?: string;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ title, content, template, featured_image }) => {
    switch (template) {
        case 'minimal':
            return <MinimalTemplate title={title} content={content} featured_image={featured_image} />;
        case 'basic':
            return <BasicTemplate title={title} content={content} featured_image={featured_image} />;
        case 'modern':
            return <ModernTemplate title={title} content={content} featured_image={featured_image} />;
        default:
            return <div>Unknown template</div>;
    }
};

export default TemplateLoader;