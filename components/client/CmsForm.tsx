import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { supabase } from '@lib/supabaseClient';
import PostList from './PostList';
import { Post, CustomField } from './types';

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

interface CmsFormProps {
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSubmit: (data: FormValues) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    editingPost: any;
    profiles: { id: string }; // Add profiles to the props
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (id: string) => void;
}

const CmsForm: React.FC<CmsFormProps> = ({
    formValues,
    setFormValues,
    handleSubmit,
    handleImageUpload,
    loading,
    editingPost,
    profiles, // Destructure profiles from props
    posts,
    handleEdit,
    handleDelete,
}) => {
    const { register, handleSubmit: handleFormSubmit } = useForm<FormValues>({
        defaultValues: formValues,
    });

    const [templateName, setTemplateName] = useState('');
    const [sections, setSections] = useState<any[]>([]); // Define sections state
    const [activeTab, setActiveTab] = useState<'form' | 'posts'>('form'); // Define active tab state

    const saveTemplate = async () => {
        const { error } = await supabase.from('templates').insert([
            { user_id: profiles.id, name: templateName, sections: JSON.stringify(sections) }
        ]);
        if (error) console.error(error);
    };

    return (
        <div>
            <div className="tabs flex gap-1 border-b-2 border-zinc-500 mb-2">
                <button
                    className={`tab bg-zinc-600 text-sm px-4 py-2 text-white ${activeTab === 'form' ? 'active border-b-0 bg-blue-500 dark:bg-blue-500' : ''}`}
                    style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                    onClick={() => setActiveTab('form')}
                >
                    Form
                </button>
                <button
                    className={`tab bg-zinc-600 text-sm px-4 py-2 text-white ${activeTab === 'posts' ? 'active border-b-0 bg-blue-500 dark:bg-blue-500' : ''}`}
                    style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }} // Equivalent to rounded-t-lg
                    onClick={() => setActiveTab('posts')}
                >
                    Saved Posts &amp; Templates
                </button>
            </div>

            {activeTab === 'form' && (
                <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
                    <div className='flex justify-start items-center gap-4 w-full'>
                        <div className='w-1/2 flex flex-col text-base'>
                            <label htmlFor="title" className="block text-base md:text-base font-semibold text-gray-950 dark:text-primary">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register('title', { required: true })}
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className='w-1/2 flex flex-col text-base'>
                            <label htmlFor="slug" className="block text-sm md:text-base font-semibold text-gray-950 dark:text-primary">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                {...register('slug')}
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm md:text-base font-semibold mb-1 text-gray-950 dark:text-primary">
                            Content (Body)
                        </label>
                        <div className="border border-gray-300 text-zinc-900 rounded-md shadow-sm p-2">
                            <textarea
                                id="content"
                                {...register('content', { required: true })}
                                className="w-full h-64 p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-2 text-base'>
                        <div>
                            <label htmlFor="featured_image" className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Featured Image
                            </label>
                            <input
                                type="file"
                                id="featured_image"
                                onChange={handleImageUpload}
                                className="mt-1 block w-full border text-gray-300 border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {formValues.featured_image && (
                                <Image src={formValues.featured_image} width={100} height={100} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                            )}
                        </div>
                    </div>
                    <div>
                        {formValues.customFields?.map((field, index) => (
                            <div key={index} className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Field Name"
                                    value={field.name}
                                    onChange={(e) => setFormValues((prevValues) => ({
                                        ...prevValues,
                                        customFields: prevValues.customFields?.map((customField, i) =>
                                            i === index ? { ...customField, name: e.target.value } : customField
                                        ) || [],
                                    }))}
                                    className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                />
                                {field.type === 'header' && (
                                    <input
                                        type="text"
                                        placeholder="Header Field"
                                        value={field.value}
                                        onChange={(e) => setFormValues((prevValues) => ({
                                            ...prevValues,
                                            customFields: prevValues.customFields?.map((customField, i) =>
                                                i === index ? { ...customField, value: e.target.value } : customField
                                            ) || [],
                                        }))}
                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                )}
                                {field.type === 'text' && (
                                    <textarea
                                        placeholder="Text Field"
                                        value={field.value}
                                        onChange={(e) => setFormValues((prevValues) => ({
                                            ...prevValues,
                                            customFields: prevValues.customFields?.map((customField, i) =>
                                                i === index ? { ...customField, value: e.target.value } : customField
                                            ) || [],
                                        }))}
                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                )}
                                {field.type === 'image' && (
                                    <>
                                        <input
                                            type="file"
                                            onChange={(e) => handleImageUpload(e)}
                                            className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                        {field.value && (
                                            <img src={field.value} alt={field.alt} className="mt-2 h-32 w-32 object-cover" />
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Alt Text"
                                            value={field.alt}
                                            onChange={(e) => setFormValues((prevValues) => ({
                                                ...prevValues,
                                                customFields: prevValues.customFields?.map((customField, i) =>
                                                    i === index ? { ...customField, alt: e.target.value } : customField
                                                ) || [],
                                            }))}
                                            className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </>
                                )}
                                {field.type === 'color' && (
                                    <>
                                        <label htmlFor={`color-${index}`} className="block text-base font-semibold text-gray-950 dark:text-primary">
                                            Color Field
                                        </label>
                                        <input
                                            type="color"
                                            id={`color-${index}`}
                                            value={field.value}
                                            onChange={(e) => setFormValues((prevValues) => ({
                                                ...prevValues,
                                                customFields: prevValues.customFields?.map((customField, i) =>
                                                    i === index ? { ...customField, value: e.target.value } : customField
                                                ) || [],
                                            }))}
                                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                        <small className="text-gray-500">Select a color for this field.</small>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label htmlFor="templateName" className="block text-sm md:text-base font-semibold text-gray-950 dark:text-primary">
                            Template Name
                        </label>
                        <input
                            type="text"
                            id="templateName"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                        <button
                            type="button"
                            onClick={saveTemplate}
                            className="mt-2 py-2 px-4 w-1/4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 hover:opacity-90 hover:shadow-lg"
                        >
                            Save Template
                        </button>
                    </div>

                    <div className='flex justify-start items-center gap-4 w-full'>
                        <div>
                            <label htmlFor="status" className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Page Status
                            </label>
                            <select
                                id="status"
                                {...register('status', { required: true })}
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2.5"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scheduled_publish_date" className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Scheduled Publish Date
                            </label>
                            <input
                                type="datetime-local"
                                id="scheduled_publish_date"
                                {...register('scheduled_publish_date')}
                                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 py-2 px-4 w-1/4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-green-500 hover:opacity-90 hover:shadow-lg"
                    >
                        {loading ? 'Submitting...' : 'Submit Page'}
                    </button>
                </form>
            )}

            {activeTab === 'posts' && (
                <PostList posts={posts} handleEdit={handleEdit} handleDelete={handleDelete} />
            )}
        </div>
    );
}

export default CmsForm;