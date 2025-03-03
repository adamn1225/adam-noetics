"use client";
import React, { useRef, useEffect, forwardRef } from 'react';
import { useEditor } from "@craftjs/core";
import { Container } from "./user/Container";
import { Card } from "./user/Card";
import { Button } from "./user/Button";
import { Header } from "./user/Header";
import { TextArea } from "./user/TextArea";
import { ImageUpload } from "./user/ImageUpload";
import { OneColumnContainer } from "./user/gridlayouts/OneColumnContainer";
import { TwoColumnContainer } from "./user/gridlayouts/TwoColumnContainer";
import { ThreeColumnContainer } from "./user/gridlayouts/ThreeColumnContainer";
import { Square } from "lucide-react";

const DraggableButton = forwardRef((props, ref) => (
    <button ref={ref} {...props} />
));
DraggableButton.displayName = 'DraggableButton';

export const Toolbox = () => {
    const { connectors } = useEditor();
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            connectors.create(inputRef.current, <div />);
        }
    }, [connectors]);

    return (
        <div className="pt-10">
            <div className="flex flex-col items-center space-y-2">
                <div className='text-nowrap mb-6'>
                    <span className="text-2xl underline underline-offset-8 font-bold text-cyan-400">Drag & Drop Components</span>
                </div>
                <span className="text-2xl underline underline-offset-8 font-semibold text-gray-100">Section Type</span>
                <span className="text-lg font-medium text-gray-100 pt-2">Grid Containers Selection</span>
                <div className="flex justify-center items-center w-fit h-auto gap-2  text-sm">
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <OneColumnContainer background="#fff" padding={20} />); }} className="btn-gradient p-2 rounded text-center"><Square className='text-gray-950' size={32} /></DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <TwoColumnContainer background="#fff" padding={20} />); }} className="btn-gradient p-2 grid grid-cols-2 justify-items-center place items-stretch gap-0 rounded "><Square className='text-gray-950' size={32} /><Square className='text-gray-950' size={32} /></DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <ThreeColumnContainer background="#fff" padding={10} />); }} className="btn-gradient p-2 justify-items-center grid grid-cols-3 rounded"><Square className='text-gray-950' size={32}/><Square className='text-gray-950' size={32} /><Square className='text-gray-950' size={32} /></DraggableButton>
                </div>
                <span className="text-lg font-medium text-gray-100 pt-2">Components</span>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-fit text-nowrap mx-2 ">
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Container padding={0} background="#fff" canvas>{null}</Container>); }} className="p-2 btn-gradient rounded text-center">Container</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Header text="Header" />); }} className="btn-gradient py-1 px-2 rounded text-gray-950">Header</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Button size="small" variant="contained" color="secondary" className="text-gray-950">Click me</Button>); }} className="btn-gradient py-1 px-2 rounded text-gray-950">Button</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Card background="#fff" padding={0} text="Card content" />); }} className="btn-gradient py-1 px-2 rounded text-gray-950">Card</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <TextArea text="This is a text area" />); }} className="btn-gradient py-1 px-2 rounded text-gray-950">TextArea</DraggableButton>
                    <DraggableButton ref={ref => { if (ref) connectors.create(ref, <ImageUpload src="" alt="" width="100%" height="auto" />); }} className="btn-gradient py-1 px-2 rounded text-gray-950">ImageUpload</DraggableButton>
                </div>
            </div>
        </div>
    )
};