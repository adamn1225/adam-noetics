"use client";
import React from 'react';
import { Frame, Element } from "@craftjs/core";
import { IgContainer } from './cms/cards/IgContainer';
import { Post } from './cms/cards/Post';


const InstagramCard = () => {
    return (
                  <Frame>
                    <Element is={IgContainer} canvas>
                      <Element is={Post} background={"fff"} />
                    </Element>
                  </Frame>
    );
};

export default InstagramCard;