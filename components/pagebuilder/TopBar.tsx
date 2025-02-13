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
        <div className="px-2 py-2 mx-1 bg-gray-950 text-gray-100 w-full">
            <div className="flex items-center gap-1">
                <div className="flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={isEnabled} onChange={handleToggle} className="mr-2" />
                        <span>Enable</span>
                    </label>
                </div>
                <div>
                    <button
                        className="text-sm px-1 py-1 border border-gray-500 bg-[#3b82f6] rounded text-gray-300 bg-secondary hover:bg-gray-300 hover:text-zinc-800"
                        onClick={handleSerialize}
                    >
                        Serialize JSON to console
                    </button>
                </div>
            </div>
        </div>
    )
};