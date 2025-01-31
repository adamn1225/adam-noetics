'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Editor } from '@tinymce/tinymce-react';
import DashboardLayout from '../UserLayout';

interface Post {
    id: number;
    title: string;
    content: string;
    status: string;
    created_at?: string;
    scheduled_publish_date?: string;
}

interface FormValues {
    title: string;
    content: string;
    status: string;
    scheduled_publish_date?: string;
}

const CMSDashboard = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        title: '',
        content: '',
        status: 'draft',
        scheduled_publish_date: '',
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const updatedFormValues = { ...formValues };

        const { error } = editingPost
            ? await supabase.from('blog_posts').update(updatedFormValues).eq('id', editingPost.id)
            : await supabase.from('blog_posts').insert([{ ...updatedFormValues, created_at: new Date() }]);

        if (error) {
            console.error('Error saving post:', error);
        } else {
            console.log('Post saved successfully');

            // Trigger Netlify build when publishing
            if (formValues.status === 'published') {
                try {
                    const response = await fetch('/.netlify/functions/triggerWebhook', {
                        method: 'POST',
                        body: JSON.stringify({ status: formValues.status }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        console.log(result.message);
                    } else {
                        console.error(result.error);
                    }
                } catch (error) {
                    console.error('Failed to trigger Netlify build:', error);
                }
            }
        }

        setLoading(false);
        setFormValues({ title: '', content: '', status: 'draft', scheduled_publish_date: '' });
        setEditingPost(null);
        fetchPosts();
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormValues({
            ...post,
        });
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting post:', error);
        } else {
            console.log('Post deleted');
            fetchPosts();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleContentChange = (content: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            content,
        }));
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">CMS Dashboard</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formValues.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <div className="border border-gray-300 rounded-md shadow-sm p-2">
                            <Editor
                                apiKey='xuegfwom0nawuekck2prc9yboegxm372icviucpytplmzjr7'
                                value={formValues.content}
                                onEditorChange={handleContentChange}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help'
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formValues.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="scheduled_publish_date" className="block text-sm font-medium text-gray-700">
                            Scheduled Publish Date
                        </label>
                        <input
                            type="datetime-local"
                            id="scheduled_publish_date"
                            name="scheduled_publish_date"
                            value={formValues.scheduled_publish_date}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        {editingPost ? 'Update Post' : 'Add Post'}
                    </button>
                </form>

                <h3 className="text-xl font-semibold mt-6">Existing Posts</h3>
                <ul className="mt-4 space-y-4">
                    {posts.map((post) => (
                        <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                            <span className="font-medium">{post.title}</span>
                            <div>
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </DashboardLayout>
    );
};

export default CMSDashboard;