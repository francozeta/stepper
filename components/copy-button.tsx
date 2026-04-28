"use client";

import * as React from "react";
import copyToClipboard from "copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CopyButtonProps = Omit<React.ComponentProps<typeof Button>, "value"> & {
  value: string;
  label?: string;
  copiedLabel?: string;
  toastMessage?: string;
};

function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  toastMessage = "Copied to clipboard",
  className,
  children,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const didCopy = await writeClipboardText(value);

    if (!didCopy) {
      toast.info("Copy blocked", {
        description: "Copy it manually from the code block.",
      });
      return;
    }

    setCopied(true);
    toast.success(toastMessage);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={copied ? copiedLabel : label}
          className={cn("gap-1.5", className)}
          onClick={handleCopy}
          {...props}
        >
          {copied ? (
            <Check data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          {children ?? (
            <span className="hidden sm:inline">{copied ? copiedLabel : label}</span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        {copied ? copiedLabel : label}
      </TooltipContent>
    </Tooltip>
  );
}

async function writeClipboardText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back for embedded browsers that expose clipboard but block writes.
    }
  }

  return copyToClipboard(value, {
    format: "text/plain",
  });
}

export { CopyButton };
