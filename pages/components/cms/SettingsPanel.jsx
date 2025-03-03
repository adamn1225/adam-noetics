"use client";
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

    console.log('Selected component:', selected);

    return selected ? (
        <div className="bg-gray-950 px-2">
            <div className="flex flex-col space-y-2">

                <div className='border border-gray-200 px-6 py-3 shadow-md shadow-secondary'>
                
                    <div className="flex items-center justify-center text-gray-100 pb-2">
                            <span className="px-2 py-1 underline underline-offset-4 text-center text-white text-lg  font-medium">{selected.name} Component Selected</span>
                    </div>
                    {selected.settings && React.createElement(selected.settings)}</div>
                {selected.isDeletable && (
                    <div className="w-full justify-center flex">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm py-1 px-2 rounded mt-3"
                            onClick={() => {
                                actions.delete(selected.id);
                            }}
                        >
                            Delete Component
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};