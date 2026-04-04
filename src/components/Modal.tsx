'use client';
import React, { useEffect, useCallback, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-container" role="dialog" aria-modal="true">
                <div ref={modalRef} className={`modal-content modal-content--${size}`}>
                    {title && (
                        <div className="modal-header">
                            <h2 className="modal-title">{title}</h2>
                            <button onClick={onClose} className="modal-close" aria-label="Закрыть">✕</button>
                        </div>
                    )}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </>
    );
}
