"use"
import React, { forwardRef } from 'react';
import { useNode } from "@craftjs/core";

const DraggableImages = forwardRef(({ src, alt, ...props }, ref) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <img
      ref={ref => connect(drag(ref))}
      src={src}
      alt={alt}
      {...props}
    />
  );
});

DraggableImages.displayName = 'DraggableImages';

export default DraggableImages;