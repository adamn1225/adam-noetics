import React from 'react';
import Image from 'next/image';

interface TemplateProps {
    title: string;
    content: string;
    featured_image?: string;
}

const Minimal: React.FC<TemplateProps> = ({ title, content, featured_image }) => {
    return (
        <div className="minimal-template max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h1>
            {featured_image && <Image src={featured_image} width={600} height={400} alt="Featured" />}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default Minimal;