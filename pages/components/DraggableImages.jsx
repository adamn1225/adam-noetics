import React, { forwardRef } from 'react';
import { useEditor } from "@craftjs/core";

const DraggableImages = forwardRef(({ src, alt, ...props }, ref) => {
  const { connectors } = useEditor();

  return (
    <img
      ref={ref => connectors.create(ref, <img src={src} alt={alt} {...props} />)}
      src={src}
      alt={alt}
      {...props}
    />
  );
});

DraggableImages.displayName = 'DraggableImage';

export default DraggableImages;