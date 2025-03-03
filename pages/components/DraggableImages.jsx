"use client";
import React, { forwardRef } from "react";
import { useEditor } from "@craftjs/core";

const DraggableImages = forwardRef(({ src, alt, ...props }, ref) => {
  const { connectors } = useEditor();

  return (
    <img
      ref={(element) => {
        if (element) {
          connectors.create(element);
        }
      }}
      src={src}
      alt={alt}
      {...props}
    />
  );
});

DraggableImages.displayName = "DraggableImage";

export default DraggableImages;
