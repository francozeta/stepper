import type { ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";

import { source } from "@/lib/source";

type DocsNavIcon =
  | "book-open"
  | "boxes"
  | "code"
  | "file-check"
  | "gallery"
  | "palette"
  | "route"
  | "rocket";

type DocsNavItem = {
  title: string;
  href: string;
  icon: DocsNavIcon;
  status?: "soon";
};

type DocsNavGroup = {
  title: string;
  items: DocsNavItem[];
};

type NavFrontmatter = {
  navIcon?: DocsNavIcon;
  navTitle?: string;
};

const fallbackIconByUrl: Record<string, DocsNavIcon> = {
  "/docs": "book-open",
  "/docs/api": "code",
  "/docs/changelog": "rocket",
  "/docs/examples": "gallery",
  "/docs/forms": "file-check",
  "/docs/installation": "boxes",
  "/docs/patterns": "route",
  "/docs/stepper": "boxes",
  "/docs/styling": "palette",
};

function getDocsNavigation(): DocsNavGroup[] {
  const tree = source.getPageTree();
  const groups: DocsNavGroup[] = [];
  let currentGroup: DocsNavGroup = {
    title: "Docs",
    items: [],
  };

  for (const node of tree.children) {
    if (node.type === "separator") {
      pushGroup(groups, currentGroup);
      currentGroup = {
        title: textFromNode(node.name) || "Docs",
        items: [],
      };
      continue;
    }

    addNodeToGroup(currentGroup, node);
  }

  pushGroup(groups, currentGroup);

  return groups;
}

function addNodeToGroup(group: DocsNavGroup, node: PageTree.Node) {
  if (node.type === "page") {
    const item = getNavItem(node);

    if (item) {
      group.items.push(item);
    }

    return;
  }

  if (node.type === "folder") {
    if (node.index) {
      const item = getNavItem(node.index);

      if (item) {
        group.items.push(item);
      }
    }

    for (const child of node.children) {
      addNodeToGroup(group, child);
    }
  }
}

function getNavItem(node: PageTree.Item): DocsNavItem | null {
  if (node.external) return null;

  const page = source.getNodePage(node);
  const data = page?.data as NavFrontmatter | undefined;
  const href = node.url || "/";

  return {
    title: data?.navTitle ?? textFromNode(node.name),
    href,
    icon: data?.navIcon ?? fallbackIconByUrl[href] ?? "book-open",
    status: isSoonPage(href) ? "soon" : undefined,
  };
}

function isSoonPage(href: string) {
  return (
    href === "/docs/examples" ||
    href === "/docs/forms" ||
    href === "/docs/patterns"
  );
}

function pushGroup(groups: DocsNavGroup[], group: DocsNavGroup) {
  if (group.items.length > 0) {
    groups.push(group);
  }
}

function textFromNode(value: ReactNode): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textFromNode).join("");

  return "";
}

export { getDocsNavigation };
export type { DocsNavGroup, DocsNavIcon, DocsNavItem };
