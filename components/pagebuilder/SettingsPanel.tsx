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
        <div className=" mt-2 p-2 ">
            <div className="flex flex-col space-y-2">
                <div>
                    <div className="flex items-center text-gray-100">
                        <div className="flex-1">
                            <span className="px-2 py-1 underline text-gray-100 text-sm rounded font-semibold">{selected.name} Selected</span>
                        </div>
                    </div>
                </div>
                {selected.settings && React.createElement(selected.settings)}
                {selected.isDeletable && (
                    <div className="mt-6 w-full justify-center flex">
                        <button
                            className="bg-red-500 text-white py-1 px-2 rounded mt-12"
                            onClick={() => {
                                actions.delete(selected.id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};