import React from "react";
import { useEditor } from "@craftjs/core";

export const Topbar = () => {
    const { actions, query } = useEditor();

    const handleSerialize = () => {
        const json = query.serialize();
        console.log(json);
    };

    return (
        <div className="px-4 py-2 mt-3 mb-1 bg-gray-200">
            <div className="flex items-center">
                <div className="flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={true} className="mr-2" />
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