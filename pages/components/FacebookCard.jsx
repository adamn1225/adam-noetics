"use client";
import React from 'react';
import { Frame, Element } from "@craftjs/core";
import { FbContainer } from './cms/cards/FbContainer';

import { Post } from './cms/cards/Post';


const FacebookCard = () => {
  return (
            <Frame>
              <Element is={FbContainer} canvas>
                <Element is={Post} padding={5} background={"fff"} />
              </Element>
            </Frame>
  );
}

export default FacebookCard;