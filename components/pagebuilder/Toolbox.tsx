import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
    <button ref={ref} {...props} />
));

export const Toolbox: React.FC = () => {
    return (
        <div className="p-2 w-13">
            <div className="flex flex-col items-center space-y-2">
                <div className=''>
                    <span style={{ padding: '8px' }} className="text-xl underline font-semibold text-gray-100">Drag to add</span>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                    <DraggableButton className="btn-gradient py-2 px-4 rounded">Container</DraggableButton>
                    <DraggableButton className="btn-gradient py-2 px-4 rounded">Text</DraggableButton>
                    <DraggableButton className="btn-gradient py-2 px-4 rounded">Button</DraggableButton>
                    <DraggableButton className="btn-gradient py-2 px-4 rounded">Card</DraggableButton>
                    <DraggableButton className="btn-gradient py-2 px-4 rounded">TextArea</DraggableButton>
                </div>
            </div>
        </div>
    );
};