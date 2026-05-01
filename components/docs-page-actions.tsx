"use client";

import * as React from "react";
import copyToClipboard from "copy-to-clipboard";
import {
  Bot,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { absoluteUrl, siteConfig } from "@/lib/site";

type DocsPageActionsProps = {
  slug?: string[];
  title: string;
};

function DocsPageActions({ slug = [], title }: DocsPageActionsProps) {
  const pageUrl = absoluteUrl(slug.length ? `/${slug.join("/")}` : "/");
  const markdownPath = getMarkdownPath(slug);
  const markdownUrl = absoluteUrl(markdownPath);
  const v0Url = getOpenInV0Url();
  const prompt = `Use the Stepper documentation page "${title}" as context, then help me implement it correctly: ${markdownUrl}`;
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;

  async function copyPage() {
    const didCopy = await writeClipboardText(window.location.href || pageUrl);

    if (!didCopy) {
      toast.info("Copy blocked", {
        description: "Copy the page URL from the address bar.",
      });
      return;
    }

    toast.success("Page link copied");
  }

  return (
    <ButtonGroup>
      <Button type="button" variant="outline" size="sm" onClick={copyPage}>
        <Copy data-icon="inline-start" />
        Copy Page
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Open page actions"
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild>
            <a href={markdownPath} target="_blank" rel="noreferrer">
              <FileText />
              View as Markdown
              <ExternalLink className="ml-auto opacity-60" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={v0Url} target="_blank" rel="noreferrer">
              <span className="flex size-4 items-center justify-center font-mono text-[0.65rem] font-semibold">
                v0
              </span>
              Open in v0
              <ExternalLink className="ml-auto opacity-60" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={chatGptUrl} target="_blank" rel="noreferrer">
              <Bot />
              Open in ChatGPT
              <ExternalLink className="ml-auto opacity-60" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={claudeUrl} target="_blank" rel="noreferrer">
              <Sparkles />
              Open in Claude
              <ExternalLink className="ml-auto opacity-60" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

function getMarkdownPath(slug: string[]) {
  return slug.length ? `/markdown/${slug.join("/")}.md` : "/markdown/index.md";
}

function getOpenInV0Url() {
  const registryUrl = absoluteUrl(siteConfig.registryDemoItem);

  return `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl)}`;
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

export { DocsPageActions };
