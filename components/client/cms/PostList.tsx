import React, { useState } from 'react';
import { Post, CustomField } from '../types';
import FullPageModal from '../../FullPageModal';

interface PostListProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (id: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, handleEdit, handleDelete }) => {
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const draftPosts = posts.filter(post => post.status === 'draft');
    const publishedPosts = posts.filter(post => post.status === 'published');

    const handlePreview = (post: Post) => {
        setSelectedPost(post);
        setIsPreviewModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            handleDelete(id);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mt-6 dark:text-white">Draft Posts</h3>
            <ul className="mt-4 space-y-4">
                {draftPosts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-semibold">{post.title}</span>
                        <div>
                            <button onClick={() => handleEdit(post)} className="mr-2">Edit</button>
                            <button onClick={() => confirmDelete(post.id)}>Delete</button>
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
                            <button onClick={() => handleEdit(post)} className="mr-2">Edit</button>
                            <button onClick={() => confirmDelete(post.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedPost && (
                <FullPageModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    htmlContent={selectedPost.content_html ?? ''}
                />
            )}
        </div>
    );
};

export default PostList;