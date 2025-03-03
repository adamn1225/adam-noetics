"use client";
import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable';
import { Slider } from '@mui/material';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Rnd } from "react-rnd";

export const Header = ({ text, fontSize, textAlign, color, fontWeight, fontStyle, tagName }) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    const onResizeStop = (e, direction, ref, delta, position) => {
        setProp(props => {
            props.width = ref.style.width;
            props.height = ref.style.height;
        });
    };

    return (
        <Rnd
            onResizeStop={onResizeStop}
            style={{ zIndex: 1 }}
        >
            <div
                ref={ref => { if (ref) connect(drag(ref)); }}
                style={{ fontSize, textAlign, color, fontWeight, fontStyle }}
            >
                <ContentEditable
                    html={text}
                    onChange={e =>
                        setProp((props) =>
                            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                        )
                    }
                    tagName={tagName}
                    style={{ fontSize, textAlign, color, fontWeight, fontStyle, border: '', padding: '0 4px' }}
                />
            </div>
        </Rnd>
    )
};

const HeaderSettings = () => {
    const { actions: { setProp }, fontSize, textAlign, color, fontWeight, fontStyle, tagName } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        textAlign: node.data.props.textAlign,
        color: node.data.props.color,
        fontWeight: node.data.props.fontWeight,
        fontStyle: node.data.props.fontStyle,
        tagName: node.data.props.tagName
    }));
    const [activeTab, setActiveTab] = useState('slider');
    const [unit, setUnit] = useState('px');

    const handleFontSizeChange = (value) => {
        setProp((props) => props.fontSize = value + unit);
    };

    const handleUnitChange = (e) => {
        const newUnit = e.target.value;
        setUnit(newUnit);
        setProp((props) => props.fontSize = parseInt(fontSize, 10) + newUnit);
    };

    const handleColorChange = (e) => {
        setProp((props) => props.color = e.target.value);
    };

    const handleFontWeightChange = (e) => {
        setProp((props) => props.fontWeight = e.target.value);
    };

    const handleFontStyleChange = (e) => {
        setProp((props) => props.fontStyle = e.target.value);
    };

    const handleTagNameChange = (e) => {
        setProp((props) => props.tagName = e.target.value);
    };

    return (
        <div>
            <div className="flex justify-center space-x-2 text-gray-100">
                <button
                    onClick={() => setActiveTab('slider')}
                    className={`px-2 py-1 rounded-md ${activeTab === 'slider' ? 'bg-gray-200 text-zinc-900' : 'bg-gray-400 text-zinc-900'}`}
                >
                    Slider
                </button>
                <button
                    onClick={() => setActiveTab('css')}
                    className={`px-2 py-1 rounded-md ${activeTab === 'css' ? 'bg-gray-200 text-zinc-900' : 'bg-gray-400 text-zinc-900'}`}
                >
                    Insert CSS
                </button>
            </div>
            <div className={activeTab === 'slider' ? 'space-y-2 mt-6' : 'hidden'}>
            
                <div className="flex items-center justify-center gap-1">
                    
                    <div className="flex items-center justify-stretch w-full gap-2">
                         <label className="w-full font-semibold text-sm underline text-gray-100">Font Size
                        <Slider
                            value={fontSize ? parseInt(fontSize, 10) : 0}
                            onChange={(e, value) => handleFontSizeChange(value.toString())}
                            step={1}
                            min={7}
                            max={100}
                            valueLabelDisplay="auto"
                        /></label>
                        <input
                            value={fontSize ? parseInt(fontSize, 10) : 0}
                            onChange={(e) => handleFontSizeChange(e.target.value)}
                            type="number"
                            className={`w-12 h-7 border border-gray-300 rounded-md py-2 px-1`}
                        />
                        <select
                            value={unit}
                            onChange={handleUnitChange}
                            className="border border-gray-300 bg-white rounded-md p-1"
                        >
                            <option value="px">px</option>
                            <option value="em">em</option>
                            <option value="rem">rem</option>
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-3">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <label className="font-semibold text-normal underline text-gray-100">Tag</label>
                        <select
                            value={tagName}
                            onChange={handleTagNameChange}
                            className="border border-gray-300 py-1 rounded-sm text-zinc-900"
                        >
                            <option value="h1">h1</option>
                            <option value="h2">h2</option>
                            <option value="h3">h3</option>
                            <option value="h4">h4</option>
                            <option value="p">p</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                            <label className="underline font-semibold text-normal text-gray-100">Font Weight</label>
                            <select
                                value={fontWeight}
                                onChange={handleFontWeightChange}
                                className="border border-gray-300 rounded-sm p-1 text-zinc-900"
                            >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="bolder">Bolder</option>
                                <option value="lighter">Lighter</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-1">
                            <label className="underline font-semibold text-sm text-gray-100">Font Style</label>
                            <select
                                value={fontStyle}
                                onChange={handleFontStyleChange}
                                className="border border-gray-300 rounded-md p-1 text-zinc-900"
                            >
                                <option value="normal">Normal</option>
                                <option value="italic">Italic</option>
                                <option value="oblique">Oblique</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1">
                            <label className="underline text-sm font-semibold text-gray-100">Color</label>
                            <input className="w-6" type="color" value={color} onChange={handleColorChange} />
                        </div>
                </div>
                
                <div className="flex items-center justify-center gap-2">

                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="font-semibold underline text-lg text-gray-100">Text Alignment</label>
                    <div className="flex space-x-4">
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.textAlign = 'left')}><AlignLeft /></button>
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.textAlign = 'center')}><AlignCenter /></button>
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => setProp((props) => props.textAlign = 'right')}><AlignRight /></button>
                    </div>
                </div>

            </div>
            <div className={activeTab === 'css' ? 'flex flex-col gap-1' : 'hidden'}>
                <label className="font-semibold text-sm underline">Custom Class</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-1"
                />
                <label className="font-semibold text-sm underline">Custom CSS</label>
                <textarea
                    className="border border-gray-300 rounded-md p-1"
                    style={{ resize: 'none', height: '100px' }}
                />
            </div>
        </div>
    )
};

Header.craft = {
    props: { text: 'Header', fontSize: '20px', textAlign: 'center', color: '#fff', fontWeight: 'normal', fontStyle: 'normal', tagName: 'p', },
    related: {
        settings: HeaderSettings
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
    }
};