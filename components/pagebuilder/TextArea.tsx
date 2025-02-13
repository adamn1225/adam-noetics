import React from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable';

interface TextAreaProps {
    text: string;
    fontSize?: string;
    textAlign?: string;
    height?: string;
    width?: string;
}

export const TextArea: React.FC<TextAreaProps> & { craft?: any } = ({ text, fontSize, textAlign, height = '250px', width = 'auto' }) => {
    const { connectors: { connect, drag } } = useNode();

    const { actions: { setProp } } = useNode();
    return (
        <div>
            <div
                ref={ref => { if (ref) connect(drag(ref)); }}
                style={{ fontSize, height, width }}
            >
                <ContentEditable
                    html={text}
                    onChange={e =>
                        setProp((props: { text: string; }) =>
                            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                        )
                    }
                    tagName="p"
                    style={{ fontSize: `${fontSize}px`, textAlign, border: '1px solid #ddd', height, width }}
                />
            </div>
        </div>
    )
};

const TextAreaSettings = () => {
    const { actions: { setProp }, fontSize, height, width } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        height: node.data.props.height,
        width: node.data.props.width
    }));

    return (
        <div className="mt-2">
            <form className="flex flex-col space-y-2 w-fit border border-gray-200 p-2 rounded-md bg-white">
                <label className="font-semibold text-sm underline">Font Size</label>
                <input
                    type="range"
                    value={fontSize ? parseInt(fontSize, 10) : 0}
                    onChange={(e) => setProp((props: { fontSize: string; }) => props.fontSize = e.target.value)}
                    step={1}
                    min={7}
                    max={100}
                    className="w-full"
                />
                <label className="font-semibold text-sm underline">Height</label>
                <input
                    type="range"
                    value={parseInt(height, 10)}
                    onChange={(e) => setProp((props: { height: string; }) => props.height = `${e.target.value}px`)}
                    step={10}
                    min={50}
                    max={500}
                    className="w-full"
                />
                <label className="font-semibold text-sm underline">Width</label>
                <input
                    type="range"
                    value={parseInt(width, 10)}
                    onChange={(e) => setProp((props: { width: string; }) => props.width = `${e.target.value}px`)}
                    step={10}
                    min={50}
                    max={500}
                    className="w-full"
                />
            </form>
        </div>
    )
};

TextArea.craft = {
    props: { text: 'Default text', fontSize: '16', height: '250px', width: 'auto' },
    related: {
        settings: TextAreaSettings
    }
};