'use client';
import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

export const Collapsible = CollapsiblePrimitive.Root;

export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export function CollapsibleContent({
  children,
  ...props
}: React.ComponentPropsWithRef<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      {...props}
      className={cn(
        'overflow-hidden',
        'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
        props.className,
      )}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

export type CollapsibleProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Root
>;
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>;
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>;
