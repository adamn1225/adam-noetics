import React, { useState } from 'react';

interface SettingsPanelProps {
    selectedComponent: any;
    updateComponent: (id: string, newProps: any) => void;
    deleteComponent: (id: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ selectedComponent, updateComponent, deleteComponent }) => {
    const [settings, setSettings] = useState(selectedComponent ? selectedComponent.props : {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings((prevSettings: { [key: string]: any }) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSave = () => {
        updateComponent(selectedComponent.id, settings);
    };

    return selectedComponent ? (
        <div className="mt-2 p-2">
            <div className="flex flex-col space-y-2">
                <div>
                    <div className="flex items-center text-gray-100">
                        <div className="flex-1">
                            <span className="px-2 py-1 underline text-gray-100 text-sm rounded font-semibold">{selectedComponent.type} Selected</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-100">Size</label>
                    <select name="size" value={settings.size || ''} onChange={handleChange} className="text-zinc-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-100">Variant</label>
                    <select name="variant" value={settings.variant || ''} onChange={handleChange} className="text-zinc-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="text">Text</option>
                        <option value="outlined">Outlined</option>
                        <option value="contained">Contained</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-100">Color</label>
                    <select name="color" value={settings.color || ''} onChange={handleChange} className="text-zinc-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                    </select>
                </div>
                <div className="mt-6 w-full justify-center flex">
                    <button
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
                <div className="mt-6 w-full justify-center flex">
                    <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => deleteComponent(selectedComponent.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};