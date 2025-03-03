"use client";
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { Editor, Frame, Element } from "@craftjs/core";
import CustomModal from './CustomModal';

const CardTools = dynamic(() => import('./cms/CardTools.jsx'), { ssr: false });
const Layers = dynamic(() => import('@craftjs/layers').then(mod => mod.Layers), { ssr: false });
const FbContainer = dynamic(() => import('./cms/cards/FbContainer.jsx').then(mod => mod.default), { ssr: false });
const FbContainerSettings = dynamic(() => import('./cms/cards/FbContainer.jsx').then(mod => mod.FbContainerSettings), { ssr: false });
const SettingsPanel = dynamic(() => import('./cms/SettingsPanel.jsx'), { ssr: false });
const Container = dynamic(() => import('./cms/user/Container.jsx').then(mod => mod.default), { ssr: false });
const ContainerSettings = dynamic(() => import('./cms/user/Container.jsx').then(mod => mod.ContainerSettings), { ssr: false });
const Post = dynamic(() => import('./cms/cards/Post.jsx'), { ssr: false });
const Header = dynamic(() => import('./cms/user/Header.jsx').then(mod => mod.default), { ssr: false });
const HeaderSettings = dynamic(() => import('./cms/user/Header.jsx').then(mod => mod.HeaderSettings), { ssr: false });
const ImageUpload = dynamic(() => import('./cms/user/ImageUpload.jsx').then(mod => mod.default), { ssr: false });
const ImageUploadSettings = dynamic(() => import('./cms/user/ImageUpload.jsx').then(mod => mod.ImageUploadSettings), { ssr: false });
const OneColumnContainer = dynamic(() => import('./cms/user/gridlayouts/OneColumnContainer.jsx').then(mod => mod.default), { ssr: false });
const OneColumnContainerSettings = dynamic(() => import('./cms/user/gridlayouts/OneColumnContainer.jsx').then(mod => mod.OneColumnContainerSettings), { ssr: false });
const TwoColumnContainer = dynamic(() => import('./cms/user/gridlayouts/TwoColumnContainer.jsx').then(mod => mod.default), { ssr: false });
const TwoColumnContainerSettings = dynamic(() => import('./cms/user/gridlayouts/TwoColumnContainer.jsx').then(mod => mod.TwoColumnContainerSettings), { ssr: false });
const ThreeColumnContainer = dynamic(() => import('./cms/user/gridlayouts/ThreeColumnContainer.jsx').then(mod => mod.default), { ssr: false });
const ThreeColumnContainerSettings = dynamic(() => import('./cms/user/gridlayouts/ThreeColumnContainer.jsx').then(mod => mod.ThreeColumnContainerSettings), { ssr: false });
const SaveTemplate = dynamic(() => import('./SaveTemplate.jsx'), { ssr: false });
const StoredTemplates = dynamic(() => import('./StoredTemplates.jsx'), { ssr: false });
const Topbar = dynamic(() => import('./cms/Topbar.jsx'), { ssr: false });
const IgContainer = dynamic(() => import('./cms/cards/IgContainer.jsx').then(mod => mod.default), { ssr: false });
const IgContainerSettings = dynamic(() => import('./cms/cards/IgContainer.jsx').then(mod => mod.IgContainerSettings), { ssr: false });
const UrlConverter = dynamic(() => import('./UrlConverter.jsx'), { ssr: false });

const SmmCards = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('Facebook');
  const [convertedData, setConvertedData] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCardChange = (card) => {
    setSelectedCard(card);
  };

  const handleConvert = (data) => {
    setConvertedData(data);
  };

  useEffect(() => {
    // This effect will run whenever convertedData changes
    console.log('Converted data updated:', convertedData);
  }, [convertedData]);

  return (
    <div className='w-full h-screen bg-white dark:bg-gray-800 overflow-x-hidden'>
      <Editor resolver={{ Post, Header, HeaderSettings, ImageUploadSettings, ImageUpload, Container, ContainerSettings, TwoColumnContainer, ThreeColumnContainerSettings, ThreeColumnContainer, TwoColumnContainerSettings, OneColumnContainer, OneColumnContainerSettings, FbContainerSettings, FbContainer, IgContainer, IgContainerSettings, Post }} >
        <div className="grid grid-cols-[3fr_1fr] justify-items-between gap-y-4 h-full w-full lg:mb-0">
          <div className='flex justify-center items-normal h-full w-full'>
            <UrlConverter onConvert={handleConvert} className="url-converter-sidebar" />


            {selectedCard === 'Facebook' && (
              <div className='flex flex-col justify-normal items-center h-full w-full  mx-2'>
                <h1 className='text-blue-500 text-center py-5 text-xl font-bold'>Facebook Image Card Preview</h1>
                <Frame key={`facebook-${JSON.stringify(convertedData)}`}>
                  <Element is={FbContainer} canvas>
                    <Element is={Post} background={"#fff"} containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                  </Element>
                </Frame>
              </div>
            )}
            {selectedCard === 'Instagram' && (
              <div className='flex flex-col justify-normal items-center h-full w-full'>
                <h1 className='text-rose-700 text-center py-5 text-xl font-bold'>Instagram Image Card Preview</h1>
                <Frame key={`instagram-${JSON.stringify(convertedData)}`}>
                  <div className='flex justify-center items-start h-full w-full'>
                    <div style={{ transform: 'scale(0.5)', transformOrigin: 'top' }}>
                      <Element is={IgContainer} canvas>
                        <Element is={Post} background={"#fff"} containerType="instagram" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                      </Element>
                    </div>
                  </div>
                </Frame>
              </div>
            )}
          </div>
          <div className='relative right-0 w-[20vw] max-w-[20vw] min-w-[20vw] bg-stone-900 h-full overflow-y-auto'>
            <Topbar />
            <div className='flex flex-col justify-center items-center gap-1 px-2 overflow-y-auto'>
              <h1 className='text-white text-2xl font-bold'>Social Media Card Types</h1>
              <select className='bg-white border border-gray-300 rounded-md p-2' value={selectedCard} onChange={(e) => handleCardChange(e.target.value)}>
                <option value="Facebook">Facebook Card</option>
                <option value="Instagram">Instagram Card</option>
              </select>
              <CardTools />
              <SettingsPanel />
              <span className='bg-white w-full mt-4'><Layers expanded /></span>
              <button onClick={openModal} className="text-gradient font-bold border border-1 border-primary p-2 text-center mt-4 hover:bg-primary hover:text-white ">
                Save Template
              </button>
              <div className='w-full mt-8 bg-white p-4'>
                <StoredTemplates />
              </div>
            </div>
          </div>
        </div>
      </Editor>

      <CustomModal isOpen={modalIsOpen} onClose={closeModal}>
        <SaveTemplate />
      </CustomModal>
    </div>
  );
}

export default SmmCards;