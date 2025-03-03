"use client";
import React, { useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

export const Container = ({ background, padding = 0, margin = 0, layout = "flex", children }) => {
    const { connectors: { connect, drag }, actions: { setProp } } = useNode();
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            connect(drag(ref.current));
        }
    }, [connect, drag]);

    // Conditional Tailwind classes for flex or grid layout
    const layoutClass = layout === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 gap-2"
        : "flex flex-col gap-2";

    return (
        <div
            ref={ref}
            style={{ background, padding: `${padding}px`, margin: `${margin}px` }}
            className={`border-dotted border-2 min-h-[100px] relative ${layoutClass}`}
        >
            {children}
        </div>
    );
};

export const ContainerSettings = () => {
    const { actions: { setProp }, background, padding, margin, layout } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding || 0,
        margin: node.data.props.margin || 0,
        layout: node.data.props.layout
    }));

    return (
        <div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Background Color</label>
                <input 
                    type="color" 
                    value={background} 
                    onChange={(e) => setProp((props) => props.background = e.target.value)} 
                    className="w-full h-6 border border-gray-300 rounded-md" 
                />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Padding</label>
                <input 
                    type="number" 
                    value={padding} 
                    onChange={(e) => setProp((props) => props.padding = e.target.value)} 
                    className="w-full h-6 border border-gray-300 rounded-md" 
                />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Margin</label>
                <input 
                    type="number" 
                    value={margin} 
                    onChange={(e) => setProp((props) => props.margin = e.target.value)} 
                    className="w-full h-6 border border-gray-300 rounded-md" 
                />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Layout</label>
                <select
                    value={layout}
                    onChange={(e) => setProp((props) => props.layout = e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded-md"
                >
                    <option value="grid">Grid</option>
                    <option value="flex">Flex Column</option>
                </select>
            </div>
        </div>
    );
};

Container.craft = {
    related: {
        settings: ContainerSettings
    },
    props: {
        padding: 0, // Ensure default padding is set to 0
        margin: 0, // Ensure default margin is set to 0
    },
    rules: {
        canMoveIn: () => {
            return true; // Allow any node to move in
        },
        canMoveOut: () => {
            return true; // Allow any node to move out
        },
        canDrag: () => {
            return true; // Allow dragging
        },
        canDrop: () => {
            return true; // Allow dropping
        }
    },
    isCanvas: true
};