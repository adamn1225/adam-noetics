import React from 'react';
import DashboardLayout from '../UserLayout';
import { Toolbox } from '@components/pagebuilder/Toolbox';
import { SettingsPanel } from '@components/pagebuilder/SettingsPanel';
import { Container } from '@components/pagebuilder/Container';
import { Button } from '@components/pagebuilder/Button';
import { Card, CardTop, CardBottom } from '@components/pagebuilder/Card';
import { Text } from '@components/pagebuilder/Text';
import { TextArea } from '@components/pagebuilder/TextArea';
import { Editor, Frame, Element } from "@craftjs/core";
import { Topbar } from '@components/pagebuilder/TopBar';

export default function LandingPageBuilder() {
    return (
        <DashboardLayout>
            <div className='bg-white w-full h-full overflow-auto'>
                <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom, TextArea }}>

                    <div className='text-gray-950 h-min w-full bg-gray-800 pb-4'><Topbar /></div>
                    <div className="flex flex-col space-y-3">
                        <div className="flex space-x-3">
                            <div className="flex-1 pt-2">
                                <Frame>
                                    <Element is={Container} padding={5} background="#eee" canvas>
                                        <Card background="#fff" text="Card content" />
                                        <Element is={Container} padding={6} background="#999" canvas>
                                            <Text fontSize="small" text="It's me again!" />
                                        </Element>
                                    </Element>
                                </Frame>
                            </div>
                            <div className="w-1/6 h-screen">
                                <div className="p-4 h-screen bg-gray-800">
                                    <Toolbox />
                                    <SettingsPanel />
                                </div>
                            </div>
                        </div>
                    </div>
                </Editor>
            </div>
        </DashboardLayout>
    );
}