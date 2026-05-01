import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsTableOfContents } from "@/components/docs-toc";

function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <DocsSidebar />
      <div className="min-w-0 md:pl-64">
        <div className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-10 md:px-8 xl:grid-cols-[minmax(0,1fr)_11rem]">
          <main className="flex min-w-0 max-w-3xl flex-col gap-10">
            {children}
          </main>
          <DocsTableOfContents />
        </div>
      </div>
    </div>
  );
}

export { DocsShell };
