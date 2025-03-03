import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useEditor } from "@craftjs/core";

const SaveTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { query } = useEditor();

  // Use a valid UUID from your authentication table for testing
  const user = {
    id: process.env.NEXT_PUBLIC_UUID,
    email: 'parkwaydrive1225@gmail.com'
  };

  const handleSaveTemplate = async () => {
    setLoading(true);
    setError(null);

    try {
      const jsonData = query.serialize();

      const { data, error } = await supabase
        .from('templates')
        .insert([{ name: templateName, sections: jsonData, user_id: user.id }]);

      if (error) {
        setError(error.message);
      } else {
        alert('Template saved successfully!');
      }
    } catch (e) {
      setError('Invalid JSON data');
    }

    setLoading(false);
  };

  return (
    <div className='text-gray-950 w-full'>
      <h2>Save Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button onClick={handleSaveTemplate} disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? 'Saving...' : 'Save Template'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SaveTemplate;