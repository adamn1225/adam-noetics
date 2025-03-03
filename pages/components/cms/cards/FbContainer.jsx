"use client";
import React, { useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

export const FbContainer = ({ background, padding = 0, margin = 0, layout = "flex", children }) => {
  const { connectors: { connect, drag } } = useNode();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      connect(drag(ref.current));
    }
  }, [connect, drag]);

  return (
    <div
      ref={ref}
      style={{ background, padding: `${padding}px`, margin: `${margin}px`, height: '628px', width: '1200px', overflow: 'hidden' }}
      className={`border-dotted border-2 relative`}
    >
      {children}
    </div>
  );
};

export const FbContainerSettings = () => {
  const { actions: { setProp }, background, padding, margin, layout } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
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
    </div>
  );
};

FbContainer.craft = {
  props: {
    background: '#b3b3b3',
    padding: 0,
    margin: 0
  },
  related: {
    settings: FbContainerSettings
  },
  rules: {
    canDrop: () => false,
    canDrag: () => false,
    canMoveIn: () => true,
    canMoveOut: () => false
  },
  isCanvas: true
};