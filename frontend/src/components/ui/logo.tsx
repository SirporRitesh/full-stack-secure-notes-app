import React from 'react';

export const Logo = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <img 
      src="/images/logo.jpg" 
      alt="HD Logo" 
      className={className}
    />
  );
};