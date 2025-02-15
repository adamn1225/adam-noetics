import React, { useState } from "react";

interface TopbarProps {
    serialize: () => void;
    toggleEnabled: () => void;
    isEnabled: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ serialize, toggleEnabled, isEnabled }) => {
    return (
        <div className="px-2 py-2 mx-1 bg-gray-950 text-gray-100 w-full">
            <div className="flex flex-col items-center gap-1">
                <div className="flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={isEnabled} onChange={toggleEnabled} className="mr-2" />
                        <span>Enable</span>
                    </label>
                </div>
                <div>
                    <button
                        className="text-sm px-1 py-1 border border-gray-500 bg-[#1952ad] rounded text-gray-300 hover:bg-gray-300 hover:text-zinc-800"
                        onClick={serialize}
                    >
                        Serialize JSON to console
                    </button>
                </div>
            </div>
        </div>
    );
};