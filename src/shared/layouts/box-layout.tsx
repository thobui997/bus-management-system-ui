// components/BoxLayout.tsx
import React from 'react';

interface BoxLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BoxLayout: React.FC<BoxLayoutProps> = ({ children, className }) => {
  return (
    <div className={`flex-1 bg-white shadow-md rounded-md !p-6 border border-[#e5e4e4] ${className || ''}`}>
      {children}
    </div>
  );
};

export default BoxLayout;
