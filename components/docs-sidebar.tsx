import { DocsSidebarClient } from "@/components/docs-sidebar-client";
import { registryVersion } from "@/lib/docs";
import { getDocsNavigation } from "@/lib/docs-navigation";

function DocsSidebar() {
  return (
    <DocsSidebarClient
      navGroups={getDocsNavigation()}
      registryVersion={registryVersion}
    />
  );
}

export { DocsSidebar };
