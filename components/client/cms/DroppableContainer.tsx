import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableItemType } from '../types';

interface DroppableContainerProps {
    onDrop: (item: any) => void;
    children: React.ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ onDrop, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop({
        accept: DraggableItemType,
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    drop(ref);

    return (
        <div ref={ref} className={`droppable-container ${isOver ? 'hover' : ''}`}>
            {children}
        </div>
    );
};

export default DroppableContainer;