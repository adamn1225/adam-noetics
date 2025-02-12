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

    const addSection = (gridRows: number) => {
        const columns = Array.from({ length: gridRows }, () => []);
        setCustomFields((prevFields) => [
            ...prevFields,
            { name: `Section ${prevFields.length + 1}`, type: 'section', value: JSON.stringify(columns) },
        ]);
        setShowSectionOptions(false);
    };

    const handleDrop = (item: any) => {
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