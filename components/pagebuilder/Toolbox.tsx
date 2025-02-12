import React, { useRef, useEffect, forwardRef } from 'react';
import { Element, useEditor } from "@craftjs/core";
import { Container } from "./Container";
import { Card } from "./Card";
import { Button } from "./Button";
import { Text } from "./Text";

const DraggableButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
    <button ref={ref} {...props} />
));

export const Toolbox: React.FC = () => {
    const { connectors } = useEditor();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            connectors.create(inputRef.current, <div />);
        }
    }, [connectors]);

    return (
        <div className="p-4">
            <div className="flex flex-col items-center space-y-2">
                <div className=''>
                    <span style={{ padding: '8px' }} className="text-sm font-semibold dark:text-zinc-900">Drag to add</span>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Element is={Container} padding={20} background="#fff" canvas>{null}</Element>); }} className="btn-gradient py-2 px-4 rounded">Container</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Text text="Hi world" />); }} className="btn-gradient py-2 px-4 rounded">Text</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Button size="small" variant="contained" color="secondary">Click me</Button>); }} className="btn-gradient py-2 px-4 rounded">Button</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Card background="#fff" padding={20} text="Card content" />); }} className="btn-gradient py-2 px-4 rounded">Card</DraggableButton>
                </div>
            </div>
        </div >
    )
};