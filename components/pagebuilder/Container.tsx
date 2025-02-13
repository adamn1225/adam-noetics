import React, { useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface ContainerProps {
    background: string;
    padding?: number;
    children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ background, padding = 0, children }) => {
    const { connectors: { connect, drag } } = useNode();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            connect(drag(ref.current));
        }
    }, [connect, drag]);

    return (
        <div ref={ref} className={`m-2 p-${padding} bg-${background}`}>
            {children}
        </div>
    )
};