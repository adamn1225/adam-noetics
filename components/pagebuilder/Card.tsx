import React from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { Container } from "./Container";
import { TextArea } from "./TextArea";
import { Element, useNode } from "@craftjs/core";

interface CardProps {
    background: string;
    padding?: number;
    text: string;
    align?: string;
}

export const Card: React.FC<CardProps> = ({ align, background, padding = 20 }) => {
    return (
        <Container background={background} padding={padding}>
            <Element id="text" is={CardTop} canvas>
                <div className="text-center">
                    <Text text="Title" fontSize="20px" />
                    <div className="my-2"><Text text="Subtitle" fontSize="14px" /></div>
                </div>
            </Element>
            <Element id="textarea" is={TextArea} canvas text="Default text">
                <TextArea text="Default text" />
            </Element>
            <Element id="buttons" is={CardBottom} canvas>
                <div className="flex justify-center">
                    <Button size="small" variant="contained" color="primary">Learn more</Button>
                </div>
            </Element>
        </Container>
    )
};

interface CardTopProps {
    children: React.ReactNode;
}

interface CardTopComponent extends React.FC<CardTopProps> {
    craft: {
        rules: {
            canMoveIn: (incomingNodes: any[]) => boolean;
        };
    };
}

export const CardTop: CardTopComponent = ({ children }) => {
    const { connectors: { connect } } = useNode();
    return (
        <div ref={connect as unknown as React.LegacyRef<HTMLDivElement>} className="text-only">
            {children}
        </div>
    )
};

CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes: any[]) => incomingNodes.every(incomingNode => incomingNode.data.type === Text)
    }
};

interface CardBottomProps {
    children: React.ReactNode;
}

interface CardBottomComponent extends React.FC<CardBottomProps> {
    craft: {
        rules: {
            canMoveIn: (incomingNodes: any[]) => boolean;
        };
    };
}

export const CardBottom: CardBottomComponent = ({ children }) => {
    const { connectors: { connect } } = useNode();
    return (
        <div ref={connect as React.LegacyRef<HTMLDivElement>}>
            {children}
        </div>
    )
};

CardBottom.craft = {
    rules: {
        canMoveIn: (incomingNodes: any[]) => incomingNodes.every(incomingNode => incomingNode.data.type === Button)
    }
};