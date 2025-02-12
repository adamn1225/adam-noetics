import React from 'react';
import { useEditor } from "@craftjs/core";

export const SettingsPanel = () => {
    const { actions, selected } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable()
            };
        }

        return {
            selected
        }
    });

    return selected ? (
        <div className="bg-gray-100 mt-2 p-2 dark:text-zinc-800">
            <div className="flex flex-col space-y-2">
                <div>
                    <div className="flex items-center">
                        <div className="flex-1"><span className="text-sm font-semibold">Selected</span></div>
                        <div><span className="px-2 py-1 bg-blue-500 text-white rounded">{selected.name}</span></div>
                    </div>
                </div>
                {selected.settings && React.createElement(selected.settings)}
                {selected.isDeletable && (
                    <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => {
                            actions.delete(selected.id);
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    ) : null;
};