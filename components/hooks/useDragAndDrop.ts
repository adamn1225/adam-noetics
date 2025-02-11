import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const ItemTypes = {
    ITEM: 'item',
};

interface DragItem {
    index: number;
    type: string;
}

interface UseDragAndDropResult {
    items: any[];
    useDraggableItem: (index: number) => { isDragging: boolean; drag: any };
    useDroppableContainer: (index: number) => { drop: any };
}

export const useDragAndDrop = (initialItems: any[]): UseDragAndDropResult => {
    const [items, setItems] = useState<any[]>(initialItems);

    const moveItem = (dragIndex: number, hoverIndex: number): void => {
        const draggedItem = items[dragIndex];
        const updatedItems = [...items];
        updatedItems.splice(dragIndex, 1);
        updatedItems.splice(hoverIndex, 0, draggedItem);
        setItems(updatedItems);
    };

    const useDraggableItem = (index: number): { isDragging: boolean; drag: any } => {
        const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
            type: ItemTypes.ITEM,
            item: { index, type: ItemTypes.ITEM },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        return { isDragging, drag };
    };

    const useDroppableContainer = (index: number): { drop: any } => {
        const [, drop] = useDrop<DragItem>({
            accept: ItemTypes.ITEM,
            hover(item: DragItem) {
                if (item.index !== index) {
                    moveItem(item.index, index);
                    item.index = index;
                }
            },
        });

        return { drop };
    };

    return {
        items,
        useDraggableItem,
        useDroppableContainer,
    };
};