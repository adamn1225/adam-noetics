import React from "react";
import { Draggable } from 'react-beautiful-dnd';

interface ImageUploadProps {
    id: string;
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    index: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ id, src, alt, width, height, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style, width, height }}
                >
                    <img
                        src={src}
                        alt={alt}
                        style={{ width, height }}
                    />
                </div>
            )}
        </Draggable>
    );
};