import React from 'react';

export default function NGLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <img
      src="/primary-logo5.png"
      alt="Neargoal Consulting Logo"
      className={`${className} object-contain`}
    />
  );
}
