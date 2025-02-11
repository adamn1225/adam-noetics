import React from "react";
import Image from "next/image";

interface BlogTemplateProps {
    title: string;
    content: string;
    featured_image?: string;
    imageDimensions?: { width: number; height: number };
}

const Modern: React.FC<BlogTemplateProps> = ({ title, content, featured_image, imageDimensions }) => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h1>
            {featured_image && imageDimensions && (
                <div className="mb-6">
                    <Image
                        src={featured_image}
                        alt={title}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                        className="rounded-lg"
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

export default Modern;