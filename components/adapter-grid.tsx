import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiFramer, SiReacthookform, SiReactquery, SiZod } from "react-icons/si";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdapterStatus = "available" | "soon";

type AdapterCard = {
  id: "react-hook-form" | "zod" | "zustand" | "framer-motion" | "tanstack";
  title: string;
  description: string;
  href?: string;
  status: AdapterStatus;
};

const adapters: AdapterCard[] = [
  {
    id: "react-hook-form",
    title: "React Hook Form",
    description: "Persist field state across steps while Stepper controls progress.",
    href: "/docs/adapters/react-hook-form",
    status: "available",
  },
  {
    id: "zod",
    title: "Zod",
    description: "Gate step transitions with schemas before data reaches the backend.",
    status: "soon",
  },
  {
    id: "zustand",
    title: "Zustand",
    description: "Keep flow state outside the form for multi-screen product journeys.",
    status: "soon",
  },
  {
    id: "framer-motion",
    title: "Framer Motion",
    description: "Add presence and transitions without moving animation into the core.",
    status: "soon",
  },
  {
    id: "tanstack",
    title: "TanStack",
    description: "Coordinate server-backed form, query, and mutation flows.",
    status: "soon",
  },
];

function AdapterGrid() {
  return (
    <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
      {adapters.map((adapter) => (
        <AdapterCard key={adapter.id} adapter={adapter} />
      ))}
    </div>
  );
}

function AdapterCard({ adapter }: { adapter: AdapterCard }) {
  const card = (
    <article
      className={cn(
        "group flex min-h-48 flex-col justify-between bg-[#040404] p-4 transition-colors",
        adapter.status === "available" &&
          "hover:bg-white/[0.035]",
        adapter.status === "soon" && "opacity-55"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <AdapterLogo adapter={adapter} />
        <Badge
          variant="outline"
          className={cn(
            "rounded-none border-white/10 bg-white/[0.035] font-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-500",
            adapter.status === "available" && "text-zinc-200"
          )}
        >
          {adapter.status === "available" ? "Ready" : "Soon"}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-medium tracking-normal text-zinc-100">
            {adapter.title}
          </h3>
          {adapter.status === "available" ? (
            <ArrowRight
              className="size-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-100"
              aria-hidden="true"
            />
          ) : null}
        </div>
        <p className="max-w-sm text-sm leading-6 text-zinc-600">
          {adapter.description}
        </p>
      </div>
    </article>
  );

  if (adapter.status === "available" && adapter.href) {
    return (
      <Link
        href={adapter.href}
        className="block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {card}
      </Link>
    );
  }

  return (
    <div className="min-w-0" aria-disabled="true">
      {card}
    </div>
  );
}

function AdapterLogo({ adapter }: { adapter: AdapterCard }) {
  const iconClassName = "size-6 text-zinc-100";

  if (adapter.id === "react-hook-form") {
    return <SiReacthookform className={iconClassName} aria-hidden="true" />;
  }

  if (adapter.id === "zod") {
    return <SiZod className={iconClassName} aria-hidden="true" />;
  }

  if (adapter.id === "framer-motion") {
    return <SiFramer className={iconClassName} aria-hidden="true" />;
  }

  if (adapter.id === "tanstack") {
    return <SiReactquery className={iconClassName} aria-hidden="true" />;
  }

  return (
    <span
      className="flex size-6 items-center justify-center border border-white/10 font-mono text-sm font-semibold text-zinc-100"
      aria-hidden="true"
    >
      Z
    </span>
  );
}

export { AdapterGrid };
