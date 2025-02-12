import React from "react";
import { useNode } from "@craftjs/core";

interface TextProps {
    text: string;
    fontSize?: string;
}

export const Text: React.FC<TextProps> = ({ text, fontSize }) => {
    const { connectors: { connect, drag } } = useNode();
    return (
        <div
            ref={ref => { if (ref) connect(drag(ref)); }}
            style={{ fontSize }}
        >
            <p>{text}</p>
        </div>
    )
};