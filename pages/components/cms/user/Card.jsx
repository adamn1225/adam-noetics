"use client";
import React, { useRef, useEffect } from "react";
import { Element, useNode } from "@craftjs/core";
import { Container, ContainerSettings } from "./Container";
import { TextArea, TextAreaSettings } from "./TextArea";
import { Header, HeaderSettings } from "./Header";
import { Button, ButtonSettings } from "./Button";

export const CardTop = ({ children }) => {
    const { connectors: { connect } } = useNode();
    return (
        <div ref={connect} className="text-only">
            {children}
        </div>
    );
};

CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => 
            incomingNode.data.type === Header || 
            incomingNode.data.type === TextArea || 
            incomingNode.data.type === Button
        )
    }
};

export const Card = ({ background, padding = 0, borderColor = 'gray-400', height = '', gap = '4', layout = 'grid' }) => {
    const { connectors: { connect, drag } } = useNode();
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            connect(drag(ref.current));
        }
    }, [connect, drag]);

    const layoutClass = layout === "grid"
    ? `flex flex-col gap-${gap}`
    : "flex flex-col gap-2";

    return (    
        <div
        ref={ref}
        style={{ background, padding: `${padding}px`, borderColor, height: height || 'min-content' }}
        className={`m-2 border-dotted border-2 w-full ${layoutClass}`}
    >            <Element is={Header} text="Header"  id="title" background={background} fontSize={20} canvas>
                  <Header text="Header Title" fontSize={20} canvas />
                </Element>
                <Element is={Header} text="Subtitle" id="subtitle" background={background} fontSize={15} canvas>
                <Header text="Subtitle" fontSize={15} canvas />
                </Element>
                <Element is={TextArea} id="textarea" background={background} canvas>
                <TextArea text="Purpose" />
                </Element>
                <Element is={Button} id="button" background={background} canvas>
                     <Button size="small" variant="contained" color="primary" canvas >
                         Learn more
                     </Button>
                </Element>
            </div>
    );
};

export const CardSettings = () => {
    const { actions: { setProp }, background, padding, height, gap } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
        height: node.data.props.height,
        gap: node.data.props.gap
    }));

    return (
        <div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Background Color</label>
                <input type="color" value={background} onChange={(e) => setProp((props) => props.background = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Padding</label>
                <input type="number" value={padding} onChange={(e) => setProp((props) => props.padding = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Height</label>
                <input type="text" value={height || ''} onChange={(e) => setProp((props) => props.height = e.target.value || 'auto')} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Gap</label>
                <input type="number" value={gap} onChange={(e) => setProp((props) => props.gap = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
        </div>
    );
};

Card.craft = {
    displayName: "Card",
    props: {
        background: "#fff",
        padding: 20,
        gap: 0
    },
    related: {
        settings: CardSettings
    },
    rules: {
        canMoveOut: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === CardTop),
        canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === CardTop),
        canDrag: () => true,
        canDrop: () => true
    }
};