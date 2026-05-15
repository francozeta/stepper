'use client';

import { cva } from 'class-variance-authority';
import { ChevronRight, FileIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { type HTMLAttributes, type ReactElement, type ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const itemVariants = cva(
  'flex min-h-7 flex-row items-center gap-2 px-2 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-white/[0.035] hover:text-zinc-100 [&_svg]:size-3.5 [&_svg]:shrink-0',
);

export function Files({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div className={cn('not-prose border border-white/10 bg-[#040404] p-2', className)} {...props}>
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;

  disabled?: boolean;

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}

export function File({
  name,
  icon = <FileIcon className="text-zinc-600" />,
  className,
  ...rest
}: FileProps): ReactElement {
  return (
    <div className={cn(itemVariants({ className }))} {...rest}>
      {icon}
      {name}
    </div>
  );
}

export function Folder({ name, defaultOpen = false, ...props }: FolderProps): ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <CollapsibleTrigger className={cn(itemVariants({ className: 'w-full text-left' }))}>
        <ChevronRight
          className={cn(
            'text-zinc-700 transition-transform',
            open && 'rotate-90 text-zinc-500',
          )}
        />
        {open ? (
          <FolderOpen className="text-zinc-500" />
        ) : (
          <FolderIcon className="text-zinc-600" />
        )}
        {name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-3 flex flex-col border-l border-white/10 ps-2">
          {props.children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
