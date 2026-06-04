import { cn } from './utils';
import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ className, children, onClick, hover }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-surface-container transition-all duration-200',
        hover && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
