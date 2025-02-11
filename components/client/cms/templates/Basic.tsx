import React from "react";
import Image from "next/image";

interface BlogTemplateProps {
    title: string;
    content: string;
    featured_image?: string;
    imageDimensions?: { width: number; height: number };
}

const Minimal: React.FC<BlogTemplateProps> = ({ title, content, featured_image, imageDimensions }) => {
    return (
        <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-medium mb-4 text-gray-900 dark:text-white">{title}</h1>
            {featured_image && imageDimensions && (
                <div className="mb-4">
                    <Image
                        src={featured_image}
                        alt={title}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                    />
                </div>
            )}
            <div
                className="prose dark:prose-dark"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default Minimal;