import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import { Text } from "./Text";
import { Button } from "./Button";

interface CardProps {
    id: string;
    background: string;
    padding?: number;
    text: string;
    index: number;
}

export const Card: React.FC<CardProps> = ({ id, background, padding = 20, text, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style, background, padding }}
                >
                    <div className="text-center">
                        <Text id={`${id}-title`} text="Title" fontSize="20px" index={0} />
                        <div className="my-2"><Text id={`${id}-subtitle`} text="Subtitle" fontSize="14px" index={1} /></div>
                    </div>
                    <div className="flex justify-center">
                        <Button id={`${id}-button`} index={2} size="small" variant="contained" color="primary">Learn more</Button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};