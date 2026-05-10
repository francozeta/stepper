import { readFile } from "node:fs/promises";

import { CodeBlock } from "@/components/docs-content";
import { DocsExampleClient } from "@/components/docs-example-client";

type DocsExampleProps = {
  title: string;
  description: string;
  code?: string;
  codePath?: string;
  preview: React.ReactNode;
  badge?: string;
  filename?: string;
  lang?: string;
  installCommand?: string;
  openInV0Url?: string;
  showCode?: boolean;
  className?: string;
  previewClassName?: string;
};

async function DocsExample({
  title,
  description,
  code,
  codePath,
  preview,
  badge,
  filename = "example.tsx",
  lang = "tsx",
  installCommand,
  openInV0Url,
  showCode = true,
  className,
  previewClassName,
}: DocsExampleProps) {
  const shouldShowCode = showCode && Boolean(codePath || code);
  const source = shouldShowCode
    ? codePath
      ? await readExampleCode(codePath)
      : (code ?? "")
    : "";

  return (
    <DocsExampleClient
      id={toAnchorId(title)}
      title={title}
      description={description}
      code={
        shouldShowCode ? (
          <CodeBlock
            code={source}
            filename={filename}
            lang={lang}
            className="rounded-lg"
          />
        ) : null
      }
      preview={preview}
      badge={badge}
      filename={filename}
      hasCode={shouldShowCode}
      installCommand={installCommand}
      openInV0Url={openInV0Url}
      className={className}
      previewClassName={previewClassName}
    />
  );
}

async function readExampleCode(codePath: string) {
  const reader = exampleCodeReaders[codePath];

  if (!reader) {
    throw new Error(`Unknown docs example codePath: ${codePath}`);
  }

  return reader();
}

const exampleCodeReaders: Record<string, () => Promise<string>> = {
  "components/stepper-intent-onboarding.tsx": () =>
    readFile("components/stepper-intent-onboarding.tsx", "utf8"),
};

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { DocsExample };
