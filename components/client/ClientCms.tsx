'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Editor } from '@tinymce/tinymce-react';
import ContactModal from '@components/ContactModal';

interface Post {
    id: number;
    title: string;
    content: string;
    status: string;
    template: string;
    created_at?: string;
    scheduled_publish_date?: string;
    featured_image?: string;
}

interface FormValues {
    title: string;
    content: string;
    status: string;
    template: string;
    scheduled_publish_date?: string;
    featured_image?: string;
}

const ClientCms = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        title: '',
        content: '',
        status: 'draft',
        template: 'basic',
        scheduled_publish_date: '',
        featured_image: '',
    });
    const [optedIn, setOptedIn] = useState(false); // State to track opt-in status
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        const checkOptInStatus = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('User not authenticated');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('cms_enabled')
                .eq('user_id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('Failed to fetch user profile', profileError);
                return;
            }

            setOptedIn(profile.cms_enabled);
        };

        checkOptInStatus();
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
        setFormValues({ title: '', content: '', status: 'draft', template: 'basic', scheduled_publish_date: '', featured_image: '' });
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('blog-photos')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading image:', error);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('blog-photos')
            .getPublicUrl(fileName);

        setFormValues((prevValues) => ({
            ...prevValues,
            featured_image: publicUrl,
        }));
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md relative">
                {!optedIn && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-10">
                        <p className="text-lg font-semibold mb-4">Please contact us to opt-in for this feature.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                        >
                            Contact Us
                        </button>
                    </div>
                )}
                <h2 className="text-2xl font-semibold mb-4">CMS Dashboard</h2>
                <form onSubmit={handleSubmit} className={`space-y-4 ${!optedIn ? 'opacity-50 pointer-events-none' : ''}`}>
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
                        <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                            Template
                        </label>
                        <select
                            id="template"
                            name="template"
                            value={formValues.template}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="basic">Basic</option>
                            <option value="minimal">Minimal</option>
                            <option value="modern">Modern</option>
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
                    <div>
                        <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700">
                            Featured Image
                        </label>
                        <input
                            type="file"
                            id="featured_image"
                            name="featured_image"
                            onChange={handleImageUpload}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {formValues.featured_image && (
                            <img src={formValues.featured_image} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
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
            <ContactModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default ClientCms;