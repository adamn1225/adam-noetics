"use client";
import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { supabase } from '../../../lib/supabaseClient';
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

export const Topbar = () => {
    const { actions, query } = useEditor();
    const [isEnabled, setIsEnabled] = useState(true);
    const [templateName, setTemplateName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stateToLoad, setStateToLoad] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleToggle = () => {
        setIsEnabled(!isEnabled);
    };

    const handleSaveTemplate = async () => {
        setLoading(true);
        setError(null);

        // Use a valid UUID from your authentication table for testing
        const user = {
            id: process.env.NEXT_PUBLIC_UUID,
            email: 'parkwaydrive1225@gmail.com'
        };

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

    const handleCopyState = () => {
        const json = query.serialize();
        copy(lz.encodeBase64(lz.compress(json)));
        setSnackbarMessage("State copied to clipboard");
    };

    const handleLoadState = () => {
        try {
            const json = lz.decompress(lz.decodeBase64(stateToLoad));
            actions.deserialize(json);
            setSnackbarMessage("State loaded");
        } catch (e) {
            setError('Invalid compressed state');
        }
    };

    return (
        <div className="mb-2 py-2 bg-gray-950 text-gray-100 w-full">
            <div className="flex flex-col justify-center items-center gap-1">
                <div className="flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={isEnabled} onChange={handleToggle} className="mr-2" />
                        <span>Enable JSON</span>
                    </label>
                </div>
                    <input
                        type="text"
                        placeholder="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="w-fit p-2 border border-gray-300 rounded mb-2"
                    />
                <div className="flex flex-wrap justify-center gap-1 text-gray-950">
                    <button
                        className="text-sm px-1 py-1 border border-primary text-primary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={handleSaveTemplate}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Template'}
                    </button>
                    <button
                        className="text-sm px-1 py-1 border border-primary text-primary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={() => setDialogOpen(true)}
                    >
                        Load State
                    </button>
                    <button
                        className="text-sm px-1 py-1 border border-primary text-primary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>

            {showAdvanced && (
                <div className="mt-2">
                    <button
                        className="text-sm px-1 py-1 border border-primary text-primary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={handleSerialize}
                    >
                        Serialize JSON to console
                    </button>
                    <button
                        className="text-sm px-1 py-1 border border-primary text-primary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={handleCopyState}
                    >
                        Copy State
                    </button>
                </div>
            )}

            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-gray-950 p-6 rounded-lg shadow-lg relative">
                        <button onClick={() => setDialogOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                            &times;
                        </button>
                        <h2>Load State</h2>
                        <textarea
                            placeholder='Paste the compressed state here'
                            value={stateToLoad}
                            onChange={(e) => setStateToLoad(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <button onClick={handleLoadState} className="bg-blue-500 text-white p-2 rounded">
                            Load State
                        </button>
                    </div>
                </div>
            )}

            {snackbarMessage && (
                <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-2 text-center">
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};