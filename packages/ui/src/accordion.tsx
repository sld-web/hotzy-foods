'use client';

import { cn } from './utils';
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-surface-container', className)}>
      <button
        className="w-full flex items-center justify-between py-3 text-body-md font-semibold text-on-surface"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span
          className={cn(
            'material-symbols-outlined transition-transform duration-200',
            open && 'rotate-180',
          )}
        >
          expand_more
        </span>
      </button>
      {open && <div className="pb-4 text-body-md text-on-surface-variant">{children}</div>}
    </div>
  );
}
