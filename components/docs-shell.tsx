import { DocsSidebar } from "@/components/docs-sidebar";

function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <DocsSidebar />
      <div className="min-w-0 md:pl-64">
        {children}
      </div>
    </div>
  );
}

export { DocsShell };
