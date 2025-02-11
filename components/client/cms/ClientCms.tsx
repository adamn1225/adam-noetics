import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import CmsForm from './CmsForm';
import FullPageModal from '@components/FullPageModal';
import CmsEditor from './CmsEditor';
import { Post, CustomField } from '../types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface FormValues {
    title: string;
    content: string;
    content_html?: string;
    status: 'draft' | 'published';
    template: 'basic' | 'minimal' | 'modern';
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
    customFields?: CustomField[];
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

const ClientCms = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        title: '',
        content: '',
        content_html: '',
        status: 'draft',
        template: 'basic',
        scheduled_publish_date: '',
        featured_image: '',
        slug: '',
        customFields: [],
    });
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [profiles, setProfiles] = useState<{ id: string }>({ id: '' });

    useEffect(() => {
        fetchPosts();
        fetchProfiles();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data.map((post: any) => ({ ...post, id: post.id })));
        }
    };

    const fetchProfiles = async () => {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (error) {
            console.error('Error fetching profiles:', error);
        } else {
            setProfiles(data);
        }
    };

    const handleSubmit = async (data: FormValues) => {
        setLoading(true);

        const updatedFormValues = {
            ...data,
            scheduled_publish_date: data.scheduled_publish_date || null,
        };

        const { error } = editingPost
            ? await supabase.from('blog_posts').update(updatedFormValues).eq('id', editingPost.id)
            : await supabase.from('blog_posts').insert([{ ...updatedFormValues, created_at: new Date().toISOString() }]);

        if (error) {
            console.error('Error saving post:', error);
        } else {
            console.log('Post saved successfully');
        }

        setLoading(false);
        setFormValues({ title: '', content: '', content_html: '', status: 'draft', template: 'basic', slug: '', scheduled_publish_date: '', featured_image: '', customFields: [] });
        setEditingPost(null);
        fetchPosts();
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormValues({
            ...post,
            slug: post.slug || '',
            customFields: post.customFields || [],
        });
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting post:', error);
        } else {
            console.log('Post deleted');
            fetchPosts();
        }
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
        <DndProvider backend={HTML5Backend}>
            <div className="flex justify-center w-full">
                <div className="w-1/5 p-4 bg-gray-100 dark:bg-zinc-900">
                    <div className='flex justify-center mb-12'>
                        <button
                            type="button"
                            className="mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 dark:bg-blue-600 hover:opacity-90 hover:shadow-lg"
                            onClick={handlePreview}
                        >
                            Show Preview
                        </button>
                    </div>
                    <CmsEditor
                        customFields={formValues.customFields || []}
                        setCustomFields={(value: React.SetStateAction<CustomField[]>) => setFormValues((prevValues) => ({ ...prevValues, customFields: typeof value === 'function' ? value(prevValues.customFields || []) : value }))}
                    />
                </div>
                <div className="w-full p-6 bg-white dark:bg-zinc-800 text-gray-950 dark:text-primary rounded-lg shadow-md relative">
                    <h2 className="text-2xl text-gray-950 dark:text-primary font-semibold mb-4">CMS Dashboard</h2>

                    <CmsForm
                        formValues={formValues}
                        setFormValues={setFormValues}
                        handleSubmit={handleSubmit}
                        handleImageUpload={handleImageUpload}
                        loading={loading}
                        editingPost={editingPost}
                        profiles={profiles}
                        posts={posts}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />

                    <FullPageModal isOpen={showPreview} onClose={() => setShowPreview(false)} htmlContent={previewHtml || ''} />
                </div>
            </div>
        </DndProvider>
    );
};

export default ClientCms;