import React, { useState } from "react";
import { useEditor } from "@craftjs/core";

export const Topbar = () => {
    const { actions, query } = useEditor();
    const [isEnabled, setIsEnabled] = useState(true);

    const handleSerialize = () => {
        const json = query.serialize();
        console.log(json);
    };

    const handleToggle = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <div className="px-4 py-2 bg-gray-200">
            <div className="flex items-center">
                <div className="flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={isEnabled} onChange={handleToggle} className="mr-2" />
                        <span>Enable</span>
                    </label>
                </div>
                <div>
                    <button
                        className="px-2 py-1 border border-gray-500 rounded text-gray-700 hover:bg-gray-300"
                        onClick={handleSerialize}
                    >
                        Serialize JSON to console
                    </button>
                </div>
            </div>
        </div>
    )
};