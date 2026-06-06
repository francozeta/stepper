import Link from "next/link";
import { ArrowLeft, Blocks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type BlockDemoBarProps = {
  name: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

function BlockDemoBar({
  name,
  backHref = "/docs/blocks",
  backLabel = "Blocks",
  className,
}: BlockDemoBarProps) {
  return (
    <nav
      aria-label="Block preview navigation"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3 print:hidden sm:px-4",
        className
      )}
    >
      <div className="pointer-events-auto flex h-9 max-w-[calc(100vw-1.5rem)] items-center gap-1.5 rounded-full border border-white/10 bg-[#111111]/90 px-1.5 shadow-2xl shadow-black/40 backdrop-blur-md sm:h-10 sm:max-w-[calc(100vw-2rem)] sm:gap-2 sm:px-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 rounded-full px-2 text-xs text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-50"
        >
          <Link href={backHref}>
            <ArrowLeft data-icon="inline-start" />
            {backLabel}
          </Link>
        </Button>
        <Separator
          orientation="vertical"
          className="h-5 bg-white/10"
          decorative
        />
        <div className="flex min-w-0 items-center gap-2 px-2 text-xs font-semibold text-zinc-100">
          <Blocks
            className="size-3.5 shrink-0 text-zinc-500"
            aria-hidden="true"
          />
          <span className="truncate">{name}</span>
        </div>
      </div>
    </nav>
  );
}

export { BlockDemoBar };
