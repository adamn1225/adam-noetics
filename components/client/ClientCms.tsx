'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import ContactModal from '@components/ContactModal';
import CmsPreview from './CmsPreview';
import CmsForm from './CmsForm';
import PostList from './PostList';

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

interface FormValues {
    title: string;
    content: string;
    content_html?: string;
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
        content_html: '',
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
        setFormValues({ title: '', content: '', content_html: '', status: 'draft', template: 'basic', slug: '', scheduled_publish_date: '', featured_image: '' });
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
                <CmsForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                    handleSubmit={handleSubmit}
                    handleTitleChange={handleTitleChange}
                    handleChange={handleChange}
                    handleContentChange={handleContentChange}
                    handleImageUpload={handleImageUpload}
                    loading={loading}
                    editingPost={editingPost}
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                />

                {showPreview && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 dark:text-white">Preview</h3>
                        <CmsPreview
                            title={formValues.title}
                            content={formValues.content}
                            content_html={formValues.content_html}
                            template={formValues.template}
                            featured_image={formValues.featured_image}
                        />
                    </div>
                )}

                <PostList posts={posts} handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
            <ContactModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default ClientCms;