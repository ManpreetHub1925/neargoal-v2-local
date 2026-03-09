import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

export default function Logo({ className = "", variant = 'full' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <img
        src="/primary-logo5.png"
        alt="Neargoal Consulting Logo"
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img 
        src="/primary-logo5.png" 
        alt="Neargoal Consulting Logo" 
        className={`w-full h-auto ${variant === 'white' ? 'brightness-0 invert' : ''}`} 
      />
    </div>
  );
}
