import React from "react";
import { Draggable } from 'react-beautiful-dnd';

interface ContainerProps {
    id: string;
    background: string;
    padding?: number;
    children: React.ReactNode;
    columns?: number;
    borderColor?: string;
    backgroundImage?: string;
    index: number;
}

export const Container: React.FC<ContainerProps> = ({ id, background, padding = 0, children, columns = 1, borderColor = 'gray-400', backgroundImage, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`m-2 p-${padding} border-dotted border-2 min-h-[100px] relative grid grid-cols-${columns}`}
                    style={{ width: '100%', height: 'auto', backgroundColor: background, borderColor: borderColor, backgroundImage: `url(${backgroundImage})` }}
                >
                    {children}
                    {!children && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-2xl">+</span>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

interface ContainerSettingsProps {
    setProp: (callback: (props: any) => void) => void;
    columns: number;
    borderColor: string;
    background: string;
    backgroundImage?: string;
}

export const ContainerSettings: React.FC<ContainerSettingsProps> = ({ setProp, columns, borderColor, background, backgroundImage }) => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProp((props: { backgroundImage: string }) => props.backgroundImage = imageUrl);
        }
    };

    return (
        <div className="dark:text-white">
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-100">Columns</label>
                <select value={columns} onChange={(e) => setProp((props: { columns: number }) => props.columns = parseInt(e.target.value, 10))} className="text-zinc-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Border Color</label>
                <input type="color" value={borderColor} onChange={(e) => setProp((props: { borderColor: string }) => props.borderColor = e.target.value)} className="mt-1 block w-6 h-6 text-base border-gray-300 focus:outline-none sm:text-sm rounded-sm" />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Background Color</label>
                <input type="color" value={background} onChange={(e) => setProp((props: { background: string }) => props.background = e.target.value)} className="mt-1 block w-6 h-6 text-base border-gray-300 focus:outline-none sm:text-sm rounded-sm" />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-100">Background Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
            </div>
        </div>
    );
};