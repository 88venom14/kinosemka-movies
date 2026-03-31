import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeStyles[size]} border-2 border-cs-border border-t-white rounded-full animate-spin`} />
      {text && (
        <p className="mt-4 text-sm text-cs-text-secondary">{text}</p>
      )}
    </div>
  );
};
