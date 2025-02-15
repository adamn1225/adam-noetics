import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';

interface TextProps {
    id: string;
    text: string;
    fontSize?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    index: number;
}

export const Text: React.FC<TextProps> = ({ id, text, fontSize, textAlign, color, fontWeight, fontStyle, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style, fontSize, textAlign, color, fontWeight, fontStyle }}
                >
                    <ContentEditable
                        html={text}
                        disabled={false}
                        onChange={() => { }}
                        tagName="p"
                        style={{ fontSize, textAlign, color, fontWeight, fontStyle }}
                    />
                </div>
            )}
        </Draggable>
    );
};