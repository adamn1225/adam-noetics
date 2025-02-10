import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Field, Form, Formik } from 'formik';

interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    level?: string;
    value?: string;
    alt?: string;
}

interface CmsEditorProps {
    customFields: CustomField[];
    setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

interface Section {
    layout: string;
    background: string;
    containers: Container[];
}

interface Container {
    fields: CustomField[];
}

const CmsEditor: React.FC<CmsEditorProps> = ({ customFields, setCustomFields }) => {
    const [sections, setSections] = useState<Section[]>([]);

    const handleAddSection = (layout: "one-row" | "two-row") => {
        setSections([...sections, { layout, background: '', containers: [] }]);
    };

    const handleUpdateBackground = (index: number, type: "color" | "image", value: string) => {
        const updatedSections = sections.map((section, i) =>
            i === index ? { ...section, background: type === "color" ? value : section.background } : section
        );
        setSections(updatedSections);
    };

    const handleAddFieldToContainer = (sectionIndex: number, containerIndex: number, field: CustomField) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].containers[containerIndex].fields.push(field);
        setSections(updatedSections);
    };

    const handleAddField = (type: CustomField['type']) => {
        setCustomFields([...customFields, { name: '', type, value: '', alt: '' }]);
    };

    const handleRemoveField = (index: number) => {
        setCustomFields(customFields.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, field: string, value: string) => {
        const updatedFields = customFields.map((customField, i) =>
            i === index ? { ...customField, [field]: value } : customField
        );
        setCustomFields(updatedFields);
    };

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

        handleFieldChange(index, 'value', publicUrl);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-950 dark:text-gray-100 text-center">Add Sections</h3>
            <div>
                <div className='flex flex-col gap-1 justify-center items-center'>
                    <button className='block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg' onClick={() => handleAddSection("one-row")}>Add One Row Section</button>
                    <button className='block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg' onClick={() => handleAddSection("two-row")}>Add Two Row Section</button>
                </div>

                {sections.map((section, index) => (
                    <div key={index} className="section">
                        <div>
                            <label>Background Color</label>
                            <input type="color" onChange={(e) => handleUpdateBackground(index, "color", e.target.value)} />
                            <input type="file" onChange={(e) => handleUpdateBackground(index, "image", e.target.files?.[0]?.name || '')} />
                        </div>

                        {section.containers.map((container, cIndex) => (
                            <div key={cIndex} className="container">
                                <button onClick={() => handleAddFieldToContainer(index, cIndex, { name: '', type: "text", value: "" })}>Add Text</button>
                                <button onClick={() => handleAddFieldToContainer(index, cIndex, { name: '', type: "header", value: "", level: "h1" })}>Add Header</button>
                                <button onClick={() => handleAddFieldToContainer(index, cIndex, { name: '', type: "image", value: "" })}>Add Image</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <h3 className='font-semibold text-center text-gray-100 underline underline-offset-4 mt-4 mb-2'>Add custom fields to sections</h3>
                <button
                    type="button"
                    onClick={() => handleAddField('header')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Header Field
                </button>
                <button
                    type="button"
                    onClick={() => handleAddField('text')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Text Field
                </button>
                <button
                    type="button"
                    onClick={() => handleAddField('image')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Image Field
                </button>
                <button
                    type="button"
                    onClick={() => handleAddField('color')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Color Field
                </button>
            </div>
            {customFields.map((field, index) => (
                <div key={index} className="mb-4">

                    <input
                        type="text"
                        placeholder="Custom Field Name (optional)"
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {field.type === 'header' && (
                        <>
                            <label className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Header Field
                            </label>
                            <input
                                type="text"
                                placeholder="Header Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </>
                    )}
                    {field.type === 'text' && (
                        <>
                            <label className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Text Field
                            </label>
                            <textarea
                                placeholder="Text Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </>
                    )}
                    {field.type === 'image' && (
                        <>
                            <label className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Image Field
                            </label>
                            <input
                                type="file"
                                onChange={(e) => handleImageUpload(index, e)}
                                className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {field.value && (
                                <img src={field.value} alt={field.alt} className="mt-2 h-32 w-32 object-cover" />
                            )}
                            <input
                                type="text"
                                placeholder="Alt Text"
                                value={field.alt}
                                onChange={(e) => handleFieldChange(index, 'alt', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </>
                    )}
                    {field.type === 'color' && (
                        <>
                            <label className="block text-base font-semibold text-gray-950 dark:text-primary">
                                Color Field
                            </label>
                            <input
                                type="color"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <small className="text-gray-500">Select a color for this field.</small>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                        Remove Field
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CmsEditor;