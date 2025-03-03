"use client";
import React from "react";
import { useNode } from "@craftjs/core";
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

export const Button = ({ size, variant, color, background, textColor, borderRadius, alignment, fontWeight, url, children }) => {
    const { connectors: { connect, drag } } = useNode();
    const sizeClass = size === 'small' ? 'py-1 px-2' : size === 'medium' ? 'py-2 px-4' : 'py-3 px-6';
    const variantClass = variant === 'outlined' ? 'border border-gray-500' : variant === 'contained' ? 'bg-blue-500 text-white' : '';
    const colorClass = color === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-white';
    const alignmentClass = alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto';

    return (
        <a href={url} ref={ref => { if (ref) connect(drag(ref)) }} className={`${sizeClass} ${variantClass} ${colorClass} ${alignmentClass} rounded-md`} style={{ background, color: textColor, borderRadius: `${borderRadius}px`, fontWeight }}>
            {children}
        </a>
    );
};

export const ButtonSettings = () => {
    const {
        actions: { setProp },
        background,
        textColor,
        borderRadius,
        alignment,
        fontWeight,
        url,
    } = useNode((node) => ({
        background: node.data.props.background,
        textColor: node.data.props.textColor,
        borderRadius: node.data.props.borderRadius,
        alignment: node.data.props.alignment,
        fontWeight: node.data.props.fontWeight,
        url: node.data.props.url,
    }));

    return (
        <div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                <input
                    type="color"
                    value={background}
                    onChange={(e) => setProp((props) => (props.background = e.target.value))}
                    className="mt-1 block w-full"
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setProp((props) => (props.textColor = e.target.value))}
                    className="mt-1 block w-full"
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Border Radius</label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setProp((props) => (props.borderRadius = e.target.value))}
                    className="mt-1 block w-full"
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Alignment</label>
                <div className="flex space-x-4">
                    <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.alignment = 'left')}><AlignLeft /></button>
                    <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.alignment = 'center')}><AlignCenter /></button>
                    <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.alignment = 'right')}><AlignRight /></button>
                </div>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Font Weight</label>
                <select
                    value={fontWeight}
                    onChange={(e) => setProp((props) => (props.fontWeight = e.target.value))}
                    className="mt-1 block w-full"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                </select>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setProp((props) => (props.url = e.target.value))}
                    className="mt-1 block w-full"
                />
            </div>
        </div>
    );
};

Button.craft = {
    props: { alignment: 'center'},
    related: {
        settings: ButtonSettings,
    },
    
    related: {
        settings: ButtonSettings,
    },
};