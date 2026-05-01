"use client";

import * as React from "react";
import copyToClipboard from "copy-to-clipboard";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CopyStatus = "idle" | "copied" | "blocked";

type CopyButtonProps = Omit<React.ComponentProps<typeof Button>, "value"> & {
  value: string | (() => string | Promise<string>);
  label?: string;
  copiedLabel?: string;
  blockedLabel?: string;
  iconOnly?: boolean;
};

function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  blockedLabel = "Copy blocked",
  iconOnly = false,
  className,
  children,
  onClick,
  size,
  variant,
  ...props
}: CopyButtonProps) {
  const [status, setStatus] = React.useState<CopyStatus>("idle");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLabel =
    status === "copied"
      ? copiedLabel
      : status === "blocked"
        ? blockedLabel
        : label;

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

    const text = await resolveCopyValue(value);

    if (!text) {
      setTemporaryStatus("blocked");
      return;
    }

    const didCopy = await writeClipboardText(text);

    if (!didCopy) {
      setTemporaryStatus("blocked");
      return;
    }

    setTemporaryStatus("copied");
  }

  function setTemporaryStatus(nextStatus: CopyStatus) {
    setStatus(nextStatus);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant ?? (iconOnly ? "ghost" : "outline")}
          size={size ?? (iconOnly ? "icon" : "sm")}
          aria-label={currentLabel}
          className={cn(
            "gap-1.5",
            iconOnly &&
              "relative size-8 rounded-md text-muted-foreground before:absolute before:-inset-1.5 hover:text-foreground",
            className
          )}
          onClick={handleCopy}
          {...props}
        >
          <AnimatedCopyIcon status={status} />
          {!iconOnly && (children ?? (
            <span className="hidden sm:inline">{currentLabel}</span>
          ))}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{currentLabel}</TooltipContent>
    </Tooltip>
  );
}

function AnimatedCopyIcon({ status }: { status: CopyStatus }) {
  const Icon = status === "copied" ? Check : Copy;

  return (
    <span
      data-icon="inline-start"
      className="relative inline-flex size-4 shrink-0 items-center justify-center"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={status}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Icon className="size-4" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

async function resolveCopyValue(
  value: CopyButtonProps["value"]
): Promise<string | null> {
  try {
    return typeof value === "function" ? await value() : value;
  } catch {
    return null;
  }
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
