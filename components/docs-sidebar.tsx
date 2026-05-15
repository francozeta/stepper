import { DocsSidebarClient } from "@/components/docs-sidebar-client";
import { getDocsNavigation } from "@/lib/docs-navigation";

function DocsSidebar() {
  return (
    <DocsSidebarClient navGroups={getDocsNavigation()} />
  );
}

export { DocsSidebar };
