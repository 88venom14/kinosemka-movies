'use client';
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeMap = { sm: '1rem', md: '2rem', lg: '3rem' };
    return (
        <div className="spinner-container">
            <div className={`spinner spinner--${size}`} />
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );
}
