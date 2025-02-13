import React, { useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface ContainerProps {
    background: string;
    padding?: number;
    children: React.ReactNode;
    columns?: number;
    borderColor?: string;
}

export const Container: React.FC<ContainerProps> = ({ background, padding = 0, children, columns = 1, borderColor = 'gray-400' }) => {
    const { connectors: { connect, drag } } = useNode();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            connect(drag(ref.current));
        }
    }, [connect, drag]);

    return (
        <div
            ref={ref}
            className={`m-2 p-${padding} bg-${background} border-dotted border-2 border-${borderColor} min-h-[100px] relative grid grid-cols-${columns}`}
        >
            {children}
            {!children && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-2xl">+</span>
                </div>
            )}
        </div>
    )
};

const ContainerSettings = () => {
    const { actions: { setProp }, columns, borderColor } = useNode((node) => ({
        columns: node.data.props.columns,
        borderColor: node.data.props.borderColor
    }));

    return (
        <div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-100">Columns</label>
                <select value={columns} onChange={(e) => setProp((props: { columns: number }) => props.columns = parseInt(e.target.value, 10))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Border Color</label>
                <input type="color" value={borderColor} onChange={(e) => setProp((props: { borderColor: string }) => props.borderColor = e.target.value)} className="mt-1 block w-6 h-6  text-base border-gray-300 focus:outline-none sm:text-sm rounded-sm" />
            </div>
        </div>
    );
};

(Container as any).craft = {
    related: {
        settings: ContainerSettings
    }
};