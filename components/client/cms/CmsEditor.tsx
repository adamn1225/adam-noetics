import React, { useState } from 'react';
import { CustomField } from '../types';
import DraggableItem from './DraggableItem';
import DroppableContainer from './DroppableContainer';

interface CmsEditorProps {
    customFields: CustomField[];
    setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

const CmsEditor: React.FC<CmsEditorProps> = ({ customFields, setCustomFields }) => {
    const [showSectionOptions, setShowSectionOptions] = useState(false);

    const handleFieldChange = (index: number, field: Partial<CustomField>) => {
        setCustomFields((prevFields) => {
            const newFields = [...prevFields];
            newFields[index] = { ...newFields[index], ...field };
            return newFields;
        });
    };

    const addField = (type: CustomField['type'], sectionIndex: number, columnIndex: number) => {
        setCustomFields((prevFields) => {
            const newFields = [...prevFields];
            const section = newFields[sectionIndex];
            if (section && section.type === 'section') {
                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                columns[columnIndex].push({ name: '', type, value: '' });
                section.value = JSON.stringify(columns);
            }
            return newFields;
        });
    };

    const removeField = (sectionIndex: number, columnIndex: number, fieldIndex: number) => {
        setCustomFields((prevFields) => {
            const newFields = [...prevFields];
            const section = newFields[sectionIndex];
            if (section && section.type === 'section') {
                const columns = section.value ? JSON.parse(section.value) : [[], [], []];
                columns[columnIndex].splice(fieldIndex, 1);
                section.value = JSON.stringify(columns);
            }
            return newFields;
        });
    };

    const addSection = (gridRows: number) => {
        // Add a new section with the specified grid rows
        const columns = Array(gridRows).fill([]);
        setCustomFields((prevFields) => [
            ...prevFields,
            { name: `Section ${prevFields.length + 1}`, type: 'section', value: JSON.stringify(columns) },
        ]);
        setShowSectionOptions(false);
    };

    const handleDrop = (item: any) => {
        // Handle the drop event
        console.log('Dropped item:', item);
    };

    const getGridClass = (gridRows: string) => {
        switch (gridRows) {
            case '1':
                return 'cms-row-1';
            case '2':
                return 'cms-row-2';
            case '3':
                return 'cms-row-3';
            default:
                return '';
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
            <div className="mb-4 flex flex-col items-start justify-start">
                <button
                    type="button"
                    onClick={() => setShowSectionOptions(!showSectionOptions)}
                    className="mt-2 w-full py-1.5 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white nn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Section
                </button>

                {showSectionOptions && (
                    <>
                        <h3 className='text-center mt-6 text-xs w-full text-nowrap'>Select amount of row containers in section.</h3>
                        <div className="mt-2 flex gap-1 w-full">
                            <button
                                type="button"
                                onClick={() => addSection(1)}
                                className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-sky-500 hover:opacity-90 hover:shadow-lg"
                            >
                                1 Grid Row
                            </button>
                            <button
                                type="button"
                                onClick={() => addSection(2)}
                                className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-sky-500 hover:opacity-90 hover:shadow-lg"
                            >
                                2 Grid Rows
                            </button>
                            <button
                                type="button"
                                onClick={() => addSection(3)}
                                className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-sky-500 hover:opacity-90 hover:shadow-lg"
                            >
                                3 Grid Rows
                            </button>
                        </div>
                    </>
                )}
            </div>
            <DroppableContainer onDrop={handleDrop}>
                {customFields.map((field, sectionIndex) => (
                    <DraggableItem key={sectionIndex} id={sectionIndex.toString()} type="SECTION">
                        <div className="mb-4">
                            {field.type === 'section' && (
                                <div className={`grid ${getGridClass(field.value ? JSON.parse(field.value).length.toString() : '0')}`}>
                                    {field.value && JSON.parse(field.value).map((column: CustomField[], columnIndex: number) => (
                                        <div key={columnIndex} className="p-2 border">
                                            <h4 className="text-sm font-semibold mb-2">Column {columnIndex + 1}</h4>
                                            {column.map((colField, fieldIndex) => (
                                                <div key={fieldIndex} className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Field Name"
                                                        value={colField.name}
                                                        onChange={(e) => handleFieldChange(sectionIndex, { name: e.target.value })}
                                                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                    <select
                                                        value={colField.type}
                                                        onChange={(e) => handleFieldChange(sectionIndex, { type: e.target.value as CustomField['type'] })}
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
                                                            onChange={(e) => handleFieldChange(sectionIndex, { value: e.target.value })}
                                                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                        />
                                                    )}
                                                    {colField.type === 'image' && (
                                                        <input
                                                            type="text"
                                                            placeholder="Image URL"
                                                            value={colField.value}
                                                            onChange={(e) => handleFieldChange(sectionIndex, { value: e.target.value })}
                                                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                        />
                                                    )}
                                                    {colField.type === 'header' && (
                                                        <input
                                                            type="text"
                                                            placeholder="Header Text"
                                                            value={colField.value}
                                                            onChange={(e) => handleFieldChange(sectionIndex, { value: e.target.value })}
                                                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                                                        />
                                                    )}
                                                    {colField.type === 'color' && (
                                                        <input
                                                            type="color"
                                                            value={colField.value}
                                                            onChange={(e) => handleFieldChange(sectionIndex, { value: e.target.value })}
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
                                            <div className='grid grid-cols-1 gap-2'>
                                                <button
                                                    type="button"
                                                    onClick={() => addField('text', sectionIndex, columnIndex)}
                                                    className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 hover:opacity-90 hover:shadow-lg"
                                                >
                                                    Add Text
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => addField('image', sectionIndex, columnIndex)}
                                                    className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 hover:opacity-90 hover:shadow-lg"
                                                >
                                                    Add Image
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => addField('header', sectionIndex, columnIndex)}
                                                    className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 hover:opacity-90 hover:shadow-lg"
                                                >
                                                    Add Header
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => addField('color', sectionIndex, columnIndex)}
                                                    className="mt-2 py-1 px-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-500 hover:opacity-90 hover:shadow-lg"
                                                >
                                                    Add Background Color
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DraggableItem>
                ))}
            </DroppableContainer>
        </div>
    );
};

export default CmsEditor;