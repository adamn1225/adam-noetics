import React from "react";
import { useNode } from "@craftjs/core";

interface ButtonProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ size, variant, color, children }) => {
    const { connectors: { connect, drag } } = useNode();
    const sizeClass = size === 'small' ? 'py-1 px-2' : size === 'medium' ? 'py-2 px-4' : 'py-3 px-6';
    const variantClass = variant === 'outlined' ? 'border border-gray-500' : variant === 'contained' ? 'bg-blue-500 text-white' : '';
    const colorClass = color === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-white';

    return (
        <button ref={ref => { if (ref) connect(drag(ref)) }} className={`${sizeClass} ${variantClass} ${colorClass} rounded-md`}>
            {children}
        </button>
    )
};