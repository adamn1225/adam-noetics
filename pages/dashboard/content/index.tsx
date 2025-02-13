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
            <div className='w-full h-screen'>
                <span className='bg-gray-800 w-full h-0 m-0 p-0'><h2 className='text-2xl font-semibold text-center text-gradient mt-[-6px] p-0'>Noetic Page Builder</h2></span>
                <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom, TextArea }}>


                    <div className="">
                        <div className="flex space-x-3">
                            <div className="flex-1 pt-2 bg-white h-screen overflow-auto ">
                                <Frame>
                                    <Element is={Container} padding={5} background="#eee" canvas>
                                        <Card background="#fff" text="Card content" />
                                        <Element is={Container} padding={6} background="#999" canvas>
                                            <Text fontSize="small" text="Second Section" />
                                        </Element>
                                    </Element>
                                </Frame>
                            </div>
                            <div className="w-1/6 h-screen border-4 border-b-0 border-x-0 border-t-primary">
                                <div className=' h-min w-full flex justify-end bg-gray-800  pb-4'><Topbar /></div>
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