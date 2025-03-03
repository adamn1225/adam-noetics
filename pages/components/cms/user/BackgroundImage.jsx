"use client";
import React, { useRef, useEffect, useState } from "react";
import { useNode } from "@craftjs/core";
import { Link2, Link2Off } from 'lucide-react';

export const BackgroundImage = ({ src, alt, objectFit = 'cover', objectPosition = 'center' }) => {
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
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: objectFit,
        backgroundPosition: objectPosition,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <img src={src} alt={alt} style={{ display: 'none' }} />
    </div>
  );
};

export const BackgroundImageSettings = () => {
    const { actions: { setProp }, src, alt, width, height, objectFit, objectPosition, overlayColor, overlayOpacity } = useNode((node) => ({
      src: node.data.props.src,
      alt: node.data.props.alt,
      width: node.data.props.width,
      height: node.data.props.height,
      objectFit: node.data.props.objectFit,
      objectPosition: node.data.props.objectPosition,
      overlayColor: node.data.props.overlayColor,
      overlayOpacity: node.data.props.overlayOpacity
    }));
  
    const [linkedDimensions, setLinkedDimensions] = useState(true);
  

  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProp((props) => {
            props.src = reader.result;
            props.width = 'auto';
            props.height = 'auto';
          });
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleWidthChange = (e) => {
      const newWidth = e.target.value;
      setProp((props) => props.width = newWidth);
      if (linkedDimensions) {
        const aspectRatio = width / height;
        setProp((props) => props.height = newWidth / aspectRatio);
      }
    };
  
    const handleHeightChange = (e) => {
      const newHeight = e.target.value;
      setProp((props) => props.height = newHeight);
      if (linkedDimensions) {
        const aspectRatio = width / height;
        setProp((props) => props.width = newHeight * aspectRatio);
      }
    };
  
    return (
      <div className="mt-2 flex justify-center">
        <form className="flex flex-col space-y-2 w-fit border border-gray-200 p-2 rounded-md bg-gray-950 text-gray-50">
          <label className="font-semibold text-sm underline">Image URL</label>
          <input
            type="text"
            value={src}
            onChange={(e) => setProp((props) => props.src = e.target.value)}
            className="w-full text-gray-950"
          />
          <label className="font-semibold text-sm underline">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-gray-950"
          />
          <label className="font-semibold text-sm underline">Alt Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setProp((props) => props.alt = e.target.value)}
            className="w-full text-gray-950"
          />
          <label className="font-semibold text-sm underline">Overlay Color</label>
          <input
            type="color"
            value={overlayColor}
            onChange={(e) => setProp((props) => props.overlayColor = e.target.value)}
            className="w-full text-gray-950"
          />
          <label className="font-semibold text-sm underline">Overlay Opacity</label>
          <input
            type="number"
            value={overlayOpacity}
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => setProp((props) => props.overlayOpacity = e.target.value)}
            className="w-full text-gray-950"
          />
          <div className="flex items-center gap-1">
            <label className="font-semibold text-sm underline">Width
              <input
                type="number"
                value={width}
                onChange={handleWidthChange}
                className="w-full text-gray-950"
              />
            </label>
            <span className="flex flex-col items-center justify-center gap-2">
              <label className="font-semibold text-sm underline text-nowrap">Link</label>
              <button
                type="button"
                onClick={() => setLinkedDimensions(!linkedDimensions)}
                className="text-gray-50"
              >
                {linkedDimensions ? <Link2 /> : <Link2Off />}
              </button>
            </span>
            <label className="font-semibold text-sm underline">Height
              <input
                type="number"
                value={height}
                onChange={handleHeightChange}
                className="w-full text-gray-950"
              />
            </label>
          </div>
          <label className="font-semibold text-sm underline">Object Fit</label>
          <select
            value={objectFit}
            onChange={(e) => setProp((props) => props.objectFit = e.target.value)}
            className="w-full text-gray-950"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
          <label className="font-semibold text-sm underline">Object Position</label>
          <select
            value={objectPosition}
            onChange={(e) => setProp((props) => props.objectPosition = e.target.value)}
            className="w-full text-gray-950"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </form>
      </div>
    );
  };


BackgroundImage.craft = {
  props: { src: '/chamber-crane.jpeg', alt: '', width: 'auto', height: 'auto', objectFit: 'contain', objectPosition: 'center', overlayColor: '#000', overlayOpacity: 0.4 },
  related: {
    settings: BackgroundImageSettings
  },
  rules: {
    canDrop: () => false,
    canDrag: () => false,
    canMoveIn: () => true,
    canMoveOut: () => false
  }
};