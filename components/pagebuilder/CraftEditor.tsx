import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Topbar } from './TopBar';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { Container } from './Container';
import { Card, CardTop, CardBottom } from './Card';
import { Button } from './Button';
import { Text } from './Text';

export default function CraftEditor() {
    return (
        <div className="mx-auto w-4/5">
            <h5 className="text-center text-lg font-semibold">Noetics page editor</h5>
            <div className="flex flex-col space-y-3 pt-2">
                <Editor resolver={{ Container, Text, Button, Card, CardTop, CardBottom }}>
                    <Topbar />
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <Frame>
                                <Element is={Container} padding={5} background="#eee" canvas>
                                    <Card background="#fff" text="Sample Text" />
                                </Element>
                            </Frame>
                        </div>
                        <div className="w-1/4">
                            <div className="p-4 bg-gray-100">
                                <Toolbox />
                                <SettingsPanel />
                            </div>
                        </div>
                    </div>
                </Editor>
            </div>
        </div>
    );
}