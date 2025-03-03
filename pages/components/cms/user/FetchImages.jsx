import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const FetchImages = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: { query, per_page: 10 },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        });
        setImages(response.data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for images"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="cursor-pointer" onClick={() => onSelectImage(image.urls.small)}>
            <img src={image.urls.small} alt={image.alt_description} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchImages;