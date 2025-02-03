import React from 'react';

interface TemplateProps {
    title: string;
    content: string;
    featured_image?: string;
}

const MinimalTemplate: React.FC<TemplateProps> = ({ title, content, featured_image }) => {
    return (
        <div className="minimal-template">
            <h1>{title}</h1>
            {featured_image && <img src={featured_image} alt="Featured" />}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default MinimalTemplate;