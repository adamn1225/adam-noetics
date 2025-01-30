import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';

const BlogDashboard = () => {
    const [posts, setPosts] = useState<{ id: number; title: string; content: string; published: boolean }[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        let { data, error } = await supabase.from('blog_posts').select('*');
        if (error) console.error(error);
        else if (data) setPosts(data);
    };

    const addPost = async () => {
        let { data, error } = await supabase.from('blog_posts').insert([{ title, content, published: false }]);
        if (error) console.error(error);
        else fetchPosts();
    };

    return (
        <div>
            <h2>Manage Blog Posts</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={addPost}>Add Post</button>

            <h3>Existing Posts:</h3>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.title} - {post.published ? 'Published' : 'Draft'}</li>
                ))}
            </ul>
        </div>
    );
};

export default BlogDashboard;
