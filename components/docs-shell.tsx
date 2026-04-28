import { DocsSidebar } from "@/components/docs-sidebar";

function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DocsSidebar />
      <div className="md:pl-64">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export { DocsShell };
