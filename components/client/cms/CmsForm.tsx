import React from 'react';
import { useForm } from 'react-hook-form';
import { FormValues, CustomField } from '../types';
import DraggableItem from './DraggableItem';
import DroppableContainer from './DroppableContainer';

interface CmsFormProps {
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSubmit: (data: FormValues) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    editingPost: any;
    profiles: { id: string };
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (id: string) => void;
}

const CmsForm: React.FC<CmsFormProps> = ({
    formValues,
    setFormValues,
    handleSubmit,
    handleImageUpload,
    loading,
    editingPost,
    profiles,
    posts,
    handleEdit,
    handleDelete,
}) => {
    const { register, handleSubmit: handleFormSubmit } = useForm<FormValues>({
        defaultValues: formValues,
    });

    const moveField = (dragIndex: number, hoverIndex: number) => {
        const draggedField = formValues.customFields?.[dragIndex];
        if (draggedField) {
            const newFields = [...(formValues.customFields || [])];
            newFields.splice(dragIndex, 1);
            newFields.splice(hoverIndex, 0, draggedField);
            setFormValues((prevValues) => ({ ...prevValues, customFields: newFields }));
        }
    };

    const removeField = (sectionIndex: number, columnIndex: number, fieldIndex: number) => {
        setFormValues((prevValues) => {
            const newFields = [...(prevValues.customFields || [])];
            const section = newFields[sectionIndex];
            if (section && section.type === 'section') {
                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                columns[columnIndex].splice(fieldIndex, 1);
                section.value = JSON.stringify(columns);
            }
            return { ...prevValues, customFields: newFields };
        });
    };

    const getGridClass = (gridRows: string) => {
        switch (gridRows) {
            case '1':
                return 'grid-row-1';
            case '2':
                return 'grid-row-2';
            case '3':
                return 'grid-row-3';
            default:
                return '';
        }
    };

    return (
        <form onSubmit={handleFormSubmit(handleSubmit)}>
            <div className="space-y-4">
                <div className="flex justify-start items-center gap-4 w-full">
                    <div className="w-1/2 flex flex-col gap-2 text-base">
                        <label htmlFor="title" className="block text-sm md:text-base font-semibold text-gray-950 dark:text-primary">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: true })}
                            className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col gap-2 text-base">
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

                <div className="w-1/2 flex flex-col gap-2 text-base">
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
                        <img src={formValues.featured_image} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                    )}
                </div>

                <DroppableContainer onDrop={(item: any) => moveField(item.dragIndex, item.hoverIndex)}>
                    {formValues.customFields?.map((field, sectionIndex) => (
                        <DraggableItem key={sectionIndex} id={sectionIndex.toString()} type="SECTION">
                            <div className={`mb-4 ${field.type === 'section' ? `grid ${getGridClass(field.value || '')}` : ''}`}>
                                {field.type === 'section' && field.value && JSON.parse(field.value).map((column: CustomField[], columnIndex: number) => (
                                    <div key={columnIndex} className="p-2 border">
                                        {column.map((colField, fieldIndex) => (
                                            <div key={fieldIndex} className="mb-2">
                                                <h4 className="text-sm font-semibold mb-2">Column {columnIndex + 1}</h4>
                                                <input
                                                    type="text"
                                                    placeholder="Field Name"
                                                    value={colField.name}
                                                    onChange={(e) => setFormValues((prevValues) => {
                                                        const newFields = [...(prevValues.customFields || [])];
                                                        const section = newFields[sectionIndex];
                                                        if (section && section.type === 'section') {
                                                            const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                            columns[columnIndex][fieldIndex].name = e.target.value;
                                                            section.value = JSON.stringify(columns);
                                                        }
                                                        return { ...prevValues, customFields: newFields };
                                                    })}
                                                    className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                />
                                                <select
                                                    value={colField.type}
                                                    onChange={(e) => setFormValues((prevValues) => {
                                                        const newFields = [...(prevValues.customFields || [])];
                                                        const section = newFields[sectionIndex];
                                                        if (section && section.type === 'section') {
                                                            const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                            columns[columnIndex][fieldIndex].type = e.target.value as CustomField['type'];
                                                            section.value = JSON.stringify(columns);
                                                        }
                                                        return { ...prevValues, customFields: newFields };
                                                    })}
                                                    className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="image">Image</option>
                                                    <option value="header">Header</option>
                                                    <option value="color">Background Color</option>
                                                </select>
                                                {colField.type === 'text' && (
                                                    <textarea
                                                        placeholder="Text Field"
                                                        value={colField.value}
                                                        onChange={(e) => setFormValues((prevValues) => {
                                                            const newFields = [...(prevValues.customFields || [])];
                                                            const section = newFields[sectionIndex];
                                                            if (section && section.type === 'section') {
                                                                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                                columns[columnIndex][fieldIndex].value = e.target.value;
                                                                section.value = JSON.stringify(columns);
                                                            }
                                                            return { ...prevValues, customFields: newFields };
                                                        })}
                                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                )}
                                                {colField.type === 'image' && (
                                                    <input
                                                        type="text"
                                                        placeholder="Image URL"
                                                        value={colField.value}
                                                        onChange={(e) => setFormValues((prevValues) => {
                                                            const newFields = [...(prevValues.customFields || [])];
                                                            const section = newFields[sectionIndex];
                                                            if (section && section.type === 'section') {
                                                                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                                columns[columnIndex][fieldIndex].value = e.target.value;
                                                                section.value = JSON.stringify(columns);
                                                            }
                                                            return { ...prevValues, customFields: newFields };
                                                        })}
                                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                )}
                                                {colField.type === 'header' && (
                                                    <input
                                                        type="text"
                                                        placeholder="Header Text"
                                                        value={colField.value}
                                                        onChange={(e) => setFormValues((prevValues) => {
                                                            const newFields = [...(prevValues.customFields || [])];
                                                            const section = newFields[sectionIndex];
                                                            if (section && section.type === 'section') {
                                                                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                                columns[columnIndex][fieldIndex].value = e.target.value;
                                                                section.value = JSON.stringify(columns);
                                                            }
                                                            return { ...prevValues, customFields: newFields };
                                                        })}
                                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                )}
                                                {colField.type === 'color' && (
                                                    <input
                                                        type="color"
                                                        value={colField.value}
                                                        onChange={(e) => setFormValues((prevValues) => {
                                                            const newFields = [...(prevValues.customFields || [])];
                                                            const section = newFields[sectionIndex];
                                                            if (section && section.type === 'section') {
                                                                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                                                                columns[columnIndex][fieldIndex].value = e.target.value;
                                                                section.value = JSON.stringify(columns);
                                                            }
                                                            return { ...prevValues, customFields: newFields };
                                                        })}
                                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeField(sectionIndex, columnIndex, fieldIndex)}
                                                    className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-500 hover:opacity-90 hover:shadow-lg"
                                                >
                                                    Remove Field
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </DraggableItem>
                    ))}
                </DroppableContainer>

                <button
                    type="submit"
                    className="mt-2 py-2 px-4 w-1/4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white nn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    {loading ? 'Submitting...' : 'Submit Page'}
                </button>
            </div>
        </form>
    );
};

export default CmsForm;