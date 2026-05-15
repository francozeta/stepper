import { DocsSidebar } from "@/components/docs-sidebar";

function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050505] text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden opacity-70 md:block"
      >
        <div className="absolute inset-y-0 left-64 w-px bg-white/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
      </div>

      <DocsSidebar />
      <div className="relative min-w-0 md:pl-64">
        {children}
      </div>
    </div>
  );
}

export { DocsShell };
