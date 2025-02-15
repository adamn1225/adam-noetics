import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Topbar } from './TopBar';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { Container } from './Container';
import { Card } from './Card';
import { Button } from './Button';
import { Text } from './Text';
import { TextArea } from './TextArea';

const initialItems = [
    { id: 'item-1', type: 'Card', content: <Card id="card-1" background="#fff" text="Card content" index={0} /> },
    { id: 'item-2', type: 'Text', content: <Text id="text-1" text="Hi world" index={1} /> },
    { id: 'item-3', type: 'Button', content: <Button id="button-1" size="small" variant="contained" color="secondary" index={2}>Click me</Button> },
    { id: 'item-4', type: 'Container', content: <Container id="container-1" background="#f0f0f0" index={3}>Container Content</Container> },
    { id: 'item-5', type: 'TextArea', content: <TextArea id="textarea-1" text="Editable text" index={4} setProp={() => { }} /> },
];

const CraftEditor = () => {
    const [items, setItems] = useState(initialItems);
    const [selectedComponent, setSelectedComponent] = useState<{ id: string; type: string; content: React.ReactElement } | null>(null);
    const [isEnabled, setIsEnabled] = useState(true);

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        setItems(reorderedItems);
    };

    const updateComponent = (id: string, newProps: (Partial<any> & React.Attributes) | undefined) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, content: React.cloneElement(item.content, newProps) } : item
            )
        );
    };

    const deleteComponent = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleSerialize = () => {
        const serializedItems = JSON.stringify(items, null, 2);
        console.log(serializedItems);
    };

    const handleToggle = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <div className='w-full h-screen overflow-ellipsis-y-hidden'>
            <span className='bg-gray-800 w-full h-0 m-0 p-0'>
                <h2 className='text-2xl font-semibold text-center text-gradient mt-[-6px] p-0'>Noetic Page Builder</h2>
            </span>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex space-x-3">
                    <div className="flex-1 pt-2 px-4 bg-white h-screen overflow-auto ">
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {items.map((item, index) => (
                                        <div key={item.id} style={{ marginBottom: '8px' }} onClick={() => setSelectedComponent(item)}>
                                            {React.cloneElement(item.content, { index })}
                                        </div>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="w-1/6 h-screen border-4 border-b-0 border-x-0 border-t-primary">
                        <div className=' h-min w-full flex justify-end bg-gray-800  pb-4'>
                            <Topbar
                                serialize={handleSerialize}
                                toggleEnabled={handleToggle}
                                isEnabled={isEnabled}
                            />
                        </div>
                        <div className="p-4 h-screen bg-gray-800">
                            <Toolbox />
                            <SettingsPanel
                                selectedComponent={selectedComponent}
                                updateComponent={updateComponent}
                                deleteComponent={deleteComponent}
                            />
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default CraftEditor;