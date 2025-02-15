import React from "react";
import { Draggable } from 'react-beautiful-dnd';

interface ButtonProps {
    id: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary';
    children: React.ReactNode;
    index: number;
}

export const Button: React.FC<ButtonProps> = ({ id, size, variant, color, children, index }) => {
    const sizeClass = size === 'small' ? 'py-1 px-2' : size === 'medium' ? 'py-2 px-4' : 'py-3 px-6';
    const variantClass = variant === 'outlined' ? 'border border-gray-500' : variant === 'contained' ? 'bg-blue-500 text-white' : '';
    const colorClass = color === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-white';

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <button
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${sizeClass} ${variantClass} ${colorClass} rounded-md`}
                >
                    {children}
                </button>
            )}
        </Draggable>
    );
};