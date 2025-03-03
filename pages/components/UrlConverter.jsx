"use client";
import React, { useState, useEffect } from 'react';
import DraggableImages from './DraggableImages';

const UrlConverter = ({ onConvert }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setImages([]);
    setSelectedImage('');

    try {
      let formattedUrl = url;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'http://' + formattedUrl;
      }

      // Update the URL to point to the Netlify function
      const response = await fetch(`/.netlify/functions/urlConvert?url=${encodeURIComponent(formattedUrl)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Response data:', data); // Debugging: Log the response data

      const { images = [], h1 = '', h2 = '' } = data;
      if (images.length > 0) {
        setImages(images); // Set the valid images for user selection
      }

      console.log('Extracted images:', images); // Debugging: Log the extracted images
      console.log('Extracted h1:', h1); // Debugging: Log the extracted h1
      console.log('Extracted h2:', h2); // Debugging: Log the extracted h2

      onConvert({ h1: h1 || 'Default Header', h2: h2 || 'Default Subtitle', img: images[0] || '/default-image.jpg' });
    } catch (err) {
      console.error('Error:', err); // Debugging: Log the error
      setError('Failed to fetch the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (src) => {
    setSelectedImage(src);
    onConvert({ h1: 'Default Header', h2: 'Default Subtitle', img: src });
  };

  useEffect(() => {
    if (selectedImage) {
      onConvert({ h1: 'Default Header', h2: 'Default Subtitle', img: selectedImage });
    }
  }, [selectedImage, onConvert]);

  return (
    <div className="flex flex-col gap-1 items-center justify-start py-2 px-3 bg-gray-950 w-min h-full">
      <h1 className='text-white text-sm font-semibold'>URL to SMM Card Generator</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        className="border border-gray-300 rounded-md py-[1.75px] px-2 w-fit"
      />
      <button
        onClick={handleConvert}
        className="btn-gradient text-white py-[1.75px] px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-white text-sm font-semibold">Select an Image</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((src, index) => (
              <DraggableImages
                key={index}
                src={src}
                alt={`Option ${index + 1}`}
                className={`w-24 h-24 object-cover cursor-pointer ${selectedImage === src ? 'border-2 border-blue-500' : 'border'}`}
                onClick={() => handleImageSelect(src)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlConverter;