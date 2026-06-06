import { readFile } from "node:fs/promises";

import Image from "next/image";

import {
  BlockPreviewCardClient,
  type BlockInstallCommands,
} from "@/components/block-preview-card-client";
import { CodeBlock } from "@/components/docs-content";

type BlockPreviewCardProps = {
  imageSrc: string;
  imageAlt: string;
  demoHref: string;
  codePath: string;
  filename: string;
  installCommands: BlockInstallCommands;
  className?: string;
};

async function BlockPreviewCard({
  imageSrc,
  imageAlt,
  demoHref,
  codePath,
  filename,
  installCommands,
  className,
}: BlockPreviewCardProps) {
  const source = await readFile(codePath, "utf8");

  return (
    <BlockPreviewCardClient
      demoHref={demoHref}
      installCommands={installCommands}
      className={className}
      preview={
        <div className="relative h-[clamp(12rem,28vw,20rem)] overflow-hidden bg-[#080808]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            quality={95}
            unoptimized
            className="object-cover object-top"
            sizes="(min-width: 1280px) 768px, (min-width: 768px) calc(100vw - 20rem), calc(100vw - 2rem)"
            priority={false}
          />
        </div>
      }
      code={
        <CodeBlock
          code={source}
          filename={filename}
          lang="tsx"
          className="max-h-[clamp(18rem,44vw,32rem)] rounded-none border-0"
        />
      }
    />
  );
}

export { BlockPreviewCard };
