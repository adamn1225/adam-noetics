'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import ContactModal from '@components/ContactModal';
import CmsForm from './CmsForm';
import PostList from './PostList';
import FullPageModal from '@components/FullPageModal';

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
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

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

            setOptedIn(profile.cms_enabled ?? false); // Ensure cms_enabled is a boolean
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
            : await supabase.from('blog_posts').insert([{ ...updatedFormValues, created_at: new Date().toISOString() }]);

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
        const { error } = await supabase.from('blog_posts').delete().eq('id', id.toString());
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

    const handlePreview = async () => {
        try {
            const response = await fetch("/api/blog-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            const data = await response.json();
            if (data.previewHtml) {
                setPreviewHtml(data.previewHtml);
                setShowPreview(true);
            } else {
                console.error("Failed to generate preview");
            }
        } catch (error) {
            console.error("Error fetching preview:", error);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 text-gray-950 dark:text-primary rounded-lg shadow-md relative">
                <h2 className="text-2xl text-gray-950 dark:text-primary font-semibold mb-4">CMS Dashboard</h2>
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
                />

                <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-gray-700 hover:bg-gray-800 mt-2"
                    onClick={handlePreview}
                >
                    Show Preview
                </button>

                <FullPageModal isOpen={showPreview} onClose={() => setShowPreview(false)} htmlContent={previewHtml ?? undefined}>
                    {previewHtml ? (
                        <div className="preview-container">
                            <h2>Live Preview</h2>
                            <iframe srcDoc={previewHtml} className="w-full h-[500px] border rounded-lg" />
                        </div>
                    ) : (
                        <p>Loading preview...</p>
                    )}
                </FullPageModal>

                <PostList posts={posts} handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
            <ContactModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default ClientCms;