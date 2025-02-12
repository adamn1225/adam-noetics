import React, { useRef, useEffect } from "react";
import Paper from '@mui/material/Paper';
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
        <Paper ref={ref} style={{ margin: "5px 0", background, padding: `${padding}px` }}>
            {children}
        </Paper>
    )
};