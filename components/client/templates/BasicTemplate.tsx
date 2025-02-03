import React from 'react';

interface TemplateProps {
    title: string;
    content: string;
    featured_image?: string;
}

const BasicTemplate: React.FC<TemplateProps> = ({ title, content, featured_image }) => {
    return (
        <div className="basic-template">
            <h1>{title}</h1>
            {featured_image && <img src={featured_image} alt="Featured" />}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default BasicTemplate;