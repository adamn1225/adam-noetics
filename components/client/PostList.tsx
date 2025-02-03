import React from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    content_html?: string;
    status: string;
    template: string;
    created_at?: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug?: string;
}

interface PostListProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (id: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, handleEdit, handleDelete }) => {
    const draftPosts = posts.filter(post => post.status === 'draft');
    const publishedPosts = posts.filter(post => post.status === 'published');

    return (
        <div>
            <h3 className="text-xl font-semibold mt-6 dark:text-white">Draft Posts</h3>
            <ul className="mt-4 space-y-4">
                {draftPosts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-semibold">{post.title}</span>
                        <div>
                            <button
                                onClick={() => handleEdit(post)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mt-6 dark:text-white">Published Posts</h3>
            <ul className="mt-4 space-y-4">
                {publishedPosts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-semibold">{post.title}</span>
                        <div>
                            <button
                                onClick={() => handleEdit(post)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;