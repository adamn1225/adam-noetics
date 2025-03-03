"use client";
import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { OneColumnContainer } from "./gridlayouts/OneColumnContainer";
import { TwoColumnContainer } from "./gridlayouts/TwoColumnContainer";
import { ThreeColumnContainer } from "./gridlayouts/ThreeColumnContainer";

export const Sections = () => {
    const { connectors: { connect, drag } } = useNode();
    const [sections, setSections] = useState([{ id: 1, columns: 1, selected: true }]);

    const addSection = () => {
        setSections([...sections, { id: sections.length + 1, columns: 1, selected: true }]);
    };

    const updateSectionColumns = (id, columns) => {
        setSections(sections.map(section => section.id === id ? { ...section, columns, selected: false } : section));
    };

    const getContainerComponent = (columns) => {
        switch (columns) {
            case 1:
                return OneColumnContainer;
            case 2:
                return TwoColumnContainer;
            case 3:
                return ThreeColumnContainer;
            default:
                return OneColumnContainer;
        }
    };

    return (
        <div ref={ref => connect(drag(ref))} className="w-full flex flex-col justify-center text-gray-900">
            {sections.map(section => {
                const ContainerComponent = getContainerComponent(section.columns);
                return (
                    <div key={section.id} className="mb-4">
                        {section.selected ? (
                            <div className="mb-2">
                                <label className="block text-sm font-semibold text-gray-900">Choose Grid Layout</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3].map(col => (
                                        <button
                                            key={col}
                                            onClick={() => updateSectionColumns(section.id, col)}
                                            className={`py-1 px-2 rounded ${section.columns === col ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}
                                        >
                                            {col} {col === 1 ? 'Column' : 'Columns'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <ContainerComponent>
                                <Element is="div" canvas>
                                    {null}
                                </Element>
                            </ContainerComponent>
                        )}
                    </div>
                );
            })}
            <button onClick={addSection} className="bg-blue-500 w-fit self-center text-white py-1 px-2 rounded mt-2">
                Add Section
            </button>
        </div>
    );
};