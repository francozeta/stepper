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
  const markdownPath = getMarkdownPath(slug);
  const markdownUrl = absoluteUrl(markdownPath);
  const prompt = getAssistantPrompt(markdownUrl);
  const v0Url = getOpenInV0Url({ markdownUrl, title });
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
  const copyMarkdown = async () => {
    const response = await fetch(markdownPath);

    if (!response.ok) {
      throw new Error(`Unable to load ${markdownPath}`);
    }

    return response.text();
  };

  return (
    <ButtonGroup>
      <CopyButton
        value={copyMarkdown}
        label="Copy Page"
        copiedLabel="Copied Markdown"
        hideLabelOnMobile={false}
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

function getAssistantPrompt(markdownUrl: string) {
  return [
    `I'm looking at this Stepper shadcn registry documentation: ${markdownUrl}.`,
    "Help me understand how to use the Stepper primitive.",
    "Be ready to explain concepts, give examples, or help debug based on it.",
    "Focus on the single installable component; demo blocks are separate examples.",
  ].join(" ");
}

function getOpenInV0Url({
  markdownUrl,
  title,
}: {
  markdownUrl: string;
  title: string;
}) {
  const registryUrl = absoluteUrl(siteConfig.registryItem);
  const searchParams = new URLSearchParams({
    url: registryUrl,
    title: title === siteConfig.name ? siteConfig.name : `${siteConfig.name} - ${title}`,
    prompt: getAssistantPrompt(markdownUrl),
  });

  return `https://v0.dev/chat/api/open?${searchParams.toString()}`;
}

export { DocsPageActions };
