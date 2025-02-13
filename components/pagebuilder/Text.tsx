import React from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import { Slider } from '@mui/material';

interface TextProps {
    text: string;
    fontSize?: string;
    textAlign?: string;
}

interface CustomTextProps extends TextProps {
    craft?: {
        props: {
            text: string;
            fontSize: string;
        };
        related: {
            settings: React.FC;
        };
    };
}

export const Text: React.FC<CustomTextProps> & { craft?: any } = ({ text, fontSize, textAlign }) => {
    const { connectors: { connect, drag }, hasSelectedNode, hasDraggedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
        hasDraggedNode: state.events.dragged,
    })
    );
    return (
        <div
            ref={ref => { if (ref) connect(drag(ref)); }}
            style={{ fontSize }}
        >
            <ContentEditable
                html={text}
                onChange={e =>
                    setProp((props: { text: string; }) =>
                        props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                    )
                }
                tagName="p"
                style={{ fontSize: `${fontSize}px`, textAlign, border: '1px solid #ddd' }}
            />
            {hasSelectedNode && (
                <form className="flex flex-col space-y-2 w-40 border border-gray-200 p-2 rounded-md bg-white mt-2">
                    <label className="font-semibold text-sm underline">Font Size</label>
                    <Slider
                        value={fontSize ? parseInt(fontSize, 10) : 0}
                        onChange={(e, value) => setProp((props: { fontSize: string; }) => props.fontSize = value.toString())}
                        step={1}
                        min={7}
                        max={100}
                        valueLabelDisplay="auto"
                    />
                </form>
            )}
        </div>
    )
};

const TextSettings = () => {
    const { actions: { setProp }, fontSize } = useNode((node) => ({
        fontSize: node.data.props.fontSize
    }));
    return (
        <div>
            <label className="font-semibold text-sm underline">Font Size</label>
            <Slider
                value={fontSize ? parseInt(fontSize, 10) : 0}
                onChange={(e, value) => setProp((props: { fontSize: string; }) => props.fontSize = value.toString())}
                step={1}
                min={7}
                max={100}
                valueLabelDisplay="auto"
            />
        </div>
    )
};

Text.craft = {
    props: { text: 'Header', fontSize: '20' },
    related: {
        settings: TextSettings
    }
};