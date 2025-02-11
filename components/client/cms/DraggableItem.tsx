import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
    id: string;
    type: string;
    children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, children }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const dragRef = React.useRef<HTMLDivElement>(null);
    drag(dragRef);

    return (
        <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
            {children}
        </div>
    );
};

export default DraggableItem;