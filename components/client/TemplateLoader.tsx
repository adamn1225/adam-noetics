import React from 'react';
import Basic from './cms/templates/Basic';
import Minimal from './cms/templates/Minimal';
import Modern from './cms/templates/Modern';

interface TemplateLoaderProps {
    title: string;
    content: string;
    content_html?: string;
    template: 'basic' | 'minimal' | 'modern';
    featured_image?: string;
    imageDimensions?: { width: number; height: number };
}

const templates: Record<TemplateLoaderProps['template'], React.FC<any>> = {
    basic: Basic,
    minimal: Minimal,
    modern: Modern,
};

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ title, content, content_html, template, featured_image, imageDimensions }) => {
    const TemplateComponent = templates[template] || Basic;

    return (
        <div className="template-loader">
            <TemplateComponent
                title={title}
                content={content_html || content}
                featured_image={featured_image}
                imageDimensions={imageDimensions}
            />
        </div>
    );
};

export default TemplateLoader;