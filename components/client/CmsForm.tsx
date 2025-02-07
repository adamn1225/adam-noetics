import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Image from 'next/image';

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

interface CmsFormProps {
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSubmit: (e: React.FormEvent) => void;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleContentChange: (content: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    editingPost: any;
}

const CmsForm: React.FC<CmsFormProps> = ({
    formValues,
    setFormValues,
    handleSubmit,
    handleTitleChange,
    handleChange,
    handleContentChange,
    handleImageUpload,
    loading,
    editingPost,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-950 dark:text-primary">
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
                <label htmlFor="slug" className="block text-sm font-semibold text-gray-950 dark:text-primary">
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
                <label htmlFor="content" className="block text-sm font-semibold mb-1 text-gray-950 dark:text-primary">
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
                <label htmlFor="status" className="block text-sm font-semibold text-gray-950 dark:text-primary">
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
                <label htmlFor="template" className="block text-sm font-semibold text-gray-950 dark:text-primary">
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
                <label htmlFor="scheduled_publish_date" className="block text-sm font-semibold text-gray-950 dark:text-primary">
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
                <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-950 dark:text-primary">
                    Featured Image
                </label>
                <input
                    type="file"
                    id="featured_image"
                    name="featured_image"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full border text-gray-300 border-gray-300 rounded-md shadow-sm p-2"
                />
                {formValues.featured_image && (
                    <Image src={formValues.featured_image} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                )}
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700"
                disabled={loading}
            >
                {editingPost ? 'Update Post' : 'Add Post'}
            </button>
        </form>
    );
};

export default CmsForm;