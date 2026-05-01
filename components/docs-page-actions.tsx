"use client";

import { ChevronDown } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
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
import { SiV0 } from "react-icons/si";
import { FaMarkdown } from "react-icons/fa";
import { BsClaude, BsOpenai } from "react-icons/bs";

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

  return (
    <ButtonGroup>
      <CopyButton
        value={() => window.location.href || pageUrl}
        label="Copy Page"
        copiedLabel="Copied"
        variant="outline"
        size="sm"
      />
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
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem asChild>
            <a href={markdownPath} target="_blank" rel="noreferrer">
              <FaMarkdown className="size-4 text-muted-foreground" />
              View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={v0Url} target="_blank" rel="noreferrer">
              <span className="flex size-4 items-center justify-center font-mono text-[0.65rem] font-semibold">
                <SiV0 className="size-4 text-muted-foreground" />
              </span>
              Open in v0
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={chatGptUrl} target="_blank" rel="noreferrer">
              <BsOpenai className="size-4 text-muted-foreground" />
              Open in ChatGPT
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={claudeUrl} target="_blank" rel="noreferrer">
              <BsClaude className="size-4 text-muted-foreground" />
              Open in Claude
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

export { DocsPageActions };
