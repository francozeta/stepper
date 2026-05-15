"use client";

import { ChevronDown } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
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
    <div role="group" className="flex w-fit items-stretch">
      <CopyButton
        value={copyMarkdown}
        label="Copy Page"
        copiedLabel="Copied Markdown"
        hideLabelOnMobile={false}
        variant="outline"
        size="sm"
        className="rounded-none! border-white/10 bg-[#050505] text-zinc-300 hover:bg-white/[0.045] hover:text-zinc-100"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-none! border-l-0 border-white/10 bg-[#050505] text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100"
            aria-label="Open page actions"
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-auto rounded-none border-white/10 bg-[#050505] text-zinc-300 shadow-none"
        >
          <DropdownMenuItem
            asChild
            className="rounded-none hover:bg-white/[0.045] focus:bg-white/[0.045] focus:text-zinc-100"
          >
            <a href={markdownPath} target="_blank" rel="noreferrer">
              <FaMarkdown className="size-4 text-zinc-500" />
              View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            asChild
            className="rounded-none hover:bg-white/[0.045] focus:bg-white/[0.045] focus:text-zinc-100"
          >
            <a href={v0Url} target="_blank" rel="noreferrer">
              <span className="flex size-4 items-center justify-center font-mono text-[0.65rem] font-semibold">
                <SiV0 className="size-4 text-zinc-500" />
              </span>
              Open in v0
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="rounded-none hover:bg-white/[0.045] focus:bg-white/[0.045] focus:text-zinc-100"
          >
            <a href={chatGptUrl} target="_blank" rel="noreferrer">
              <BsOpenai className="size-4 text-zinc-500" />
              Open in ChatGPT
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="rounded-none hover:bg-white/[0.045] focus:bg-white/[0.045] focus:text-zinc-100"
          >
            <a href={claudeUrl} target="_blank" rel="noreferrer">
              <BsClaude className="size-4 text-zinc-500" />
              Open in Claude
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
