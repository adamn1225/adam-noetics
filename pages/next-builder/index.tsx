import React from 'react';
import RootLayout from '../layout';
import { Toolbox } from '@components/pagebuilder/Toolbox';
import { SettingsPanel } from '@components/pagebuilder/SettingsPanel';
import { Container } from '@components/pagebuilder/Container';
import { Button } from '@components/pagebuilder/Button';
import { Card, CardTop, CardBottom } from '@components/pagebuilder/Card';
import { Text } from '@components/pagebuilder/Text';
import { Editor, Frame, Element } from "@craftjs/core";
import { Topbar } from '@components/pagebuilder/TopBar';

export default function LandingPageBuilder() {
    return (
        <RootLayout>
            <div className='bg-white p-6  w-full h-[95vh] mt-6'>
                <h5 className="text-center text-3xl font-semibold">Noetic Page Builder</h5>
                <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom }}>
                    <Topbar />
                    <div className="flex flex-col space-y-3 pt-2">
                        <div className="flex space-x-3">
                            <div className="flex-1">
                                <Frame>
                                    <Element is={Container} padding={5} background="#eee" canvas>
                                        <Card background="#fff" text="Card content" />
                                        <Text text="This can be a title explaining the button below" fontSize="16px" />
                                        <Button size="small" color='primary'>Click</Button>
                                        <Element is={Container} padding={6} background="#999" canvas>
                                            <Text fontSize="small" text="It's me again!" />
                                        </Element>
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
                    </div>
                </Editor>
            </div>
        </RootLayout>
    );
}