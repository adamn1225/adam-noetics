// Assuming BlogTemplate is defined in BlogTemplate.tsx

// filepath: BlogTemplate.tsx
import React from 'react';

interface BlogTemplateProps {
    title: string;
    content: string;
    featured_image?: string;
    imageDimensions?: { width: number; height: number };
}

const BlogTemplate: React.FC<BlogTemplateProps> = ({ title, content, featured_image, imageDimensions }) => {
    return (
        <div>
            <h1>{title}</h1>
            <div>{content}</div>
            {featured_image && <img src={featured_image} alt={title} />}
            {imageDimensions && (
                <div>
                    <p>Width: {imageDimensions.width}px</p>
                    <p>Height: {imageDimensions.height}px</p>
                </div>
            )}
        </div>
    );
};

export default BlogTemplate;