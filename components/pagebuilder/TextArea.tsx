import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';

interface TextAreaProps {
    id: string;
    text: string;
    fontSize?: string;
    textAlign?: string;
    height?: string;
    width?: string;
    index: number;
    setProp: (callback: (props: any) => void) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ id, text, fontSize, textAlign, height = '250px', width = 'auto', index, setProp }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ fontSize, height, width, border: '1px solid #ddd' }}
                >
                    <ContentEditable
                        html={text}
                        onChange={e =>
                            setProp((props: { text: string; }) =>
                                props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                            )
                        }
                        tagName="p"
                        style={{ fontSize: `${fontSize}px`, textAlign, height, width }}
                    />
                </div>
            )}
        </Draggable>
    );
};

interface TextAreaSettingsProps {
    setProp: (callback: (props: any) => void) => void;
    fontSize: string;
    height: string;
    width: string;
}

export const TextAreaSettings: React.FC<TextAreaSettingsProps> = ({ setProp, fontSize, height, width }) => {
    return (
        <div className="mt-2">
            <form className="flex flex-col space-y-2 w-fit border border-gray-200 p-2 rounded-md bg-white">
                <label className="font-semibold text-sm underline">Font Size</label>
                <input
                    type="range"
                    value={fontSize ? parseInt(fontSize, 10) : 0}
                    onChange={(e) => setProp((props: { fontSize: string; }) => props.fontSize = e.target.value)}
                    step={1}
                    min={7}
                    max={100}
                    className="w-full"
                />
                <label className="font-semibold text-sm underline">Height</label>
                <input
                    type="range"
                    value={parseInt(height, 10)}
                    onChange={(e) => setProp((props: { height: string; }) => props.height = `${e.target.value}px`)}
                    step={10}
                    min={50}
                    max={500}
                    className="w-full"
                />
                <label className="font-semibold text-sm underline">Width</label>
                <input
                    type="range"
                    value={parseInt(width, 10)}
                    onChange={(e) => setProp((props: { width: string; }) => props.width = `${e.target.value}px`)}
                    step={10}
                    min={50}
                    max={500}
                    className="w-full"
                />
            </form>
        </div>
    );
};