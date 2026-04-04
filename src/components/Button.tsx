'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', fullWidth = false, loading = false, children, className = '', disabled, ...props }: ButtonProps) {
    return (
        <button className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`} disabled={disabled || loading} {...props}>
            {loading && <span className="btn__spinner animate-spin" style={{ display: 'inline-block', width: '1rem', height: '1rem', marginRight: '0.5rem', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite' }} />}
            {children}
        </button>
    );
}
