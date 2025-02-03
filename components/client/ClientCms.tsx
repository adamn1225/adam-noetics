'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Editor } from '@tinymce/tinymce-react';
import ContactModal from '@components/ContactModal';
import CmsPreview from './CmsPreview';

interface Post {
    id: number;
    title: string;
    content: string;
    status: string;
    template: string;
    created_at?: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug?: string;
}

interface FormValues {
    title: string;
    content: string;
    status: string;
    template: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

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
        slug: '',
    });
    const [optedIn, setOptedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cmsToken, setCmsToken] = useState('');
    const [showPreview, setShowPreview] = useState(false);

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

        const updatedFormValues = {
            ...formValues,
            scheduled_publish_date: formValues.scheduled_publish_date || null,
        };

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
        setFormValues({ title: '', content: '', status: 'draft', template: 'basic', slug: '', scheduled_publish_date: '', featured_image: '' });
        setEditingPost(null);
        fetchPosts();
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormValues({
            ...post,
            slug: post.slug || '',
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

    const handleCmsTokenSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('User not authenticated');
            return;
        }

        const { data: member, error: memberError } = await supabase
            .from('organization_members')
            .select('cms_token')
            .eq('user_id', user.id)
            .single();

        if (memberError || !member) {
            console.error('Failed to fetch CMS token', memberError);
            return;
        }

        if (member.cms_token !== cmsToken) {
            console.error('Invalid CMS token');
            return;
        }

        setOptedIn(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormValues({
            ...formValues,
            title,
            slug: generateSlug(title),
        });
    };


    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 dark:text-white rounded-lg shadow-md relative">
                {!optedIn && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-10">
                        <p className="text-lg font-semibold mb-4">Please enter your CMS token to opt-in for this feature.</p>
                        <form onSubmit={handleCmsTokenSubmit} className="flex flex-col items-center">
                            <input
                                type="text"
                                value={cmsToken}
                                onChange={(e) => setCmsToken(e.target.value)}
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter CMS token"
                                required
                            />
                            <button
                                type="submit"
                                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                            >
                                Connect
                            </button>
                        </form>
                    </div>
                )}
                <h2 className="text-2xl font-semibold mb-4">CMS Dashboard</h2>
                <form onSubmit={handleSubmit} className={`space-y-4 ${!optedIn ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formValues.title}
                            onChange={handleTitleChange}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formValues.slug}
                            onChange={handleChange}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-white">
                            Content
                        </label>
                        <div className="border border-gray-300 text-zinc-900 rounded-md shadow-sm p-2">
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
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formValues.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="template" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Template
                        </label>
                        <select
                            id="template"
                            name="template"
                            value={formValues.template}
                            onChange={handleChange}
                            className="mt-1 block w-full text-zinc-900 border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="basic">Basic</option>
                            <option value="minimal">Minimal</option>
                            <option value="modern">Modern</option>
                            <option value="none">No template available</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="scheduled_publish_date" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Scheduled Publish Date
                        </label>
                        <input
                            type="datetime-local"
                            id="scheduled_publish_date"
                            name="scheduled_publish_date"
                            value={formValues.scheduled_publish_date}
                            onChange={handleChange}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Featured Image
                        </label>
                        <input
                            type="file"
                            id="featured_image"
                            name="featured_image"
                            onChange={handleImageUpload}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {formValues.featured_image && (
                            <img src={formValues.featured_image} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800"
                        disabled={loading}
                    >
                        {editingPost ? 'Update Post' : 'Add Post'}
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-gray-700 hover:bg-gray-800 ml-2"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </form>

                {showPreview && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 dark:text-white">Preview</h3>
                        <CmsPreview
                            title={formValues.title}
                            content={formValues.content}
                            template={formValues.template}
                            featured_image={formValues.featured_image}
                        />
                    </div>
                )}

                <h3 className="text-xl font-semibold mt-6 dark:text-white">Existing Posts</h3>
                <ul className="mt-4 space-y-4">
                    {posts.map((post) => (
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
            <ContactModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default ClientCms;