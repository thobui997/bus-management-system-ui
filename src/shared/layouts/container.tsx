// components/BoxLayout.tsx
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={`!p-4 flex flex-col gap-6 overflow-hidden h-full ${className || ''}`}>{children}</div>;
};

export default Container;
