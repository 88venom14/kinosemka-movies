'use client';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <input ref={ref} id={inputId} className={`input-field ${error ? 'input-field--error' : ''}`} {...props} />
            {error && <p className="input-error">{error}</p>}
        </div>
    );
});
Input.displayName = 'Input';
