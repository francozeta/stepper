import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileCode2 } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { registryInstallCommands, rootProps, itemProps, controlledSnippet } from "@/lib/docs";
import {
  Stepper, StepperList, StepperItem, StepperTrigger, StepperIndicator,
  StepperLabel, StepperSeparator, StepperContent, StepperPrevious, StepperNext,
} from "@/components/ui/stepper";

export const metadata: Metadata = {
  title: "Stepper — Documentation study",
  description: "Install, compose and customize Stepper.",
  robots: { index: false, follow: false },
};

const neutral = {
  "--background": "#fff", "--foreground": "#222", "--primary": "#272727",
  "--primary-foreground": "#fff", "--muted": "#f4f4f4",
  "--muted-foreground": "#626262", "--border": "#d4d4d4",
  "--ring": "#555", "--input": "#d4d4d4",
  "--destructive": "#b91c1c", "--destructive-foreground": "#fff",
  colorScheme: "light",
} as CSSProperties;

const serif = "[font-family:Georgia,'Times_New_Roman',serif] font-normal tracking-[-.045em]";
const heading = serif + " text-3xl leading-tight text-[#bd171c] sm:text-4xl";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bd171c]";
const rule = "border-[#bd171c]/25";

const steps = [{ value: "account" }, { value: "details" }, { value: "review" }] as const;
const sections = [
  { id: "installation", label: "Installation" },
  { id: "example", label: "First component" },
  { id: "anatomy", label: "Anatomy" },
  { id: "control", label: "Controlled state" },
  { id: "api", label: "API reference" },
] as const;

const exampleCode = `import {
  Stepper, StepperList, StepperItem,
  StepperContent, StepperPrevious, StepperNext,
} from "@/components/ui/stepper";

const steps = [
  { value: "account" },
  { value: "details" },
  { value: "review" },
] as const;

export function AccountSetup() {
  return (
    <Stepper steps={steps} defaultValue="account">
      <StepperList>
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="review">Review</StepperItem>
      </StepperList>
      <StepperContent value="account">Create your account.</StepperContent>
      <StepperContent value="details">Add your details.</StepperContent>
      <StepperContent value="review">Review your information.</StepperContent>
      <div className="flex justify-between">
        <StepperPrevious>Back</StepperPrevious>
        <StepperNext>Continue</StepperNext>
      </div>
    </Stepper>
  );
}`;

const style = `
  .identity-docs-install [data-manager-panel] { display: none; }
  ${Object.keys(registryInstallCommands).map(key=>`.identity-docs-install:has(#docs-manager-${key}:checked) [data-manager-panel="${key}"] { display: flex; }`).join("\n")}
  .identity-docs-anatomy:not(:has(#docs-annotations:checked)) [data-doc-note] { visibility: hidden; }
  .identity-docs-anatomy:has(#docs-annotations:checked) [data-doc-target]:not(:focus-visible) {
    outline: 1px dashed #bd171c99; outline-offset: 3px;
  }
  .identity-docs-anatomy [data-doc-note] {
    position: absolute; z-index: 2; pointer-events: none;
    color: #bd171c; font-size: 11px; line-height: 1.4;
    background: #fff; padding: 2px 4px; border: 1px solid #bd171c66;
    white-space: nowrap;
  }
  .identity-docs-anatomy [data-doc-note]::after {
    content: ""; position: absolute; left: 50%; top: 100%; height: 12px;
    border-left: 1px solid #bd171caa;
  }
  .identity-docs-anatomy [data-slot="stepper-list"] { overflow: visible; }
  .identity-docs-anatomy [data-slot="stepper-item"] { min-width: 0; }
  .identity-docs-anatomy [data-doc-note="top"] { left: 50%; bottom: calc(100% + 12px); transform: translateX(-50%); }
  .identity-docs-anatomy [data-doc-note="bottom"] { left: 50%; top: calc(100% + 12px); transform: translateX(-50%); }
  .identity-docs-anatomy [data-doc-note="bottom"]::after { top: auto; bottom: 100%; }
  .identity-docs-anatomy [data-doc-note="connector"] { left: 100%; top: calc(var(--stepper-separator-y) + 42px); transform: translateX(-50%); }
  .identity-docs-anatomy [data-doc-note="connector"]::after { top: auto; bottom: 100%; height: 42px; }
`;

function Mark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" className="size-9 shrink-0 text-[#bd171c]">
    <path d="M5 34h13V23h13V12h12v24H30v7H5z" fill="currentColor"/>
    <path d="M11 39h7m6-11h7m6-11h6" stroke="#f2efeb" strokeWidth="1.2"/>
  </svg>;
}

function Code({ code, file }: { code: string; file: string }) {
  return <div style={neutral} className="min-w-0 overflow-hidden rounded-lg border border-[#242424]/15 bg-[#fff] text-foreground">
    <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border px-3">
      <span className="flex min-w-0 items-center gap-2 text-sm font-medium"><FileCode2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground"/><span className="truncate">{file}</span></span>
      <CopyButton value={code} label={"Copy "+file} iconOnly className="size-9 shrink-0"/>
    </div>
    <pre tabIndex={0} aria-label={file} className="max-h-[460px] overflow-auto px-4 py-4 font-mono text-xs leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#bd171c] sm:text-sm"><code>{code}</code></pre>
  </div>;
}

function Install() {
  return <div style={neutral} className="identity-docs-install mt-5 min-w-0 rounded-lg border border-[#242424]/15 bg-white text-foreground">
    <fieldset className="flex flex-wrap gap-1 border-b border-border px-2 py-1">
      <legend className="sr-only">Package manager</legend>
      {Object.keys(registryInstallCommands).map(key=><label key={key} className="relative cursor-pointer">
        <input type="radio" name="docs-package-manager" id={"docs-manager-"+key} defaultChecked={key==="pnpm"} className="peer sr-only"/>
        <span className="flex min-h-10 items-center rounded-md px-3 font-mono text-sm text-muted-foreground peer-checked:bg-muted peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#bd171c]">{key}</span>
      </label>)}
    </fieldset>
    {Object.entries(registryInstallCommands).map(([key,command])=><div key={key} data-manager-panel={key} className="min-w-0 items-center gap-3 px-3 py-3">
      <code className="min-w-0 flex-1 break-words font-mono text-sm leading-6">{command}</code>
      <CopyButton value={command} label={"Copy "+key+" command"} iconOnly className="size-9 shrink-0"/>
    </div>)}
  </div>;
}

function Example() {
  return <div style={neutral} className="rounded-lg border border-[#242424]/15 bg-white p-4 text-foreground sm:p-6">
    <Stepper steps={steps} defaultValue="account" className="gap-5">
      <StepperList className="[&>li]:min-w-0" aria-label="Account setup">
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="review">Review</StepperItem>
      </StepperList>
      <div className="min-h-[76px]">
        <StepperContent value="account">Create your account.</StepperContent>
        <StepperContent value="details">Add your details.</StepperContent>
        <StepperContent value="review">Review your information.</StepperContent>
      </div>
      <div className="flex justify-between gap-2">
        <StepperPrevious>Back</StepperPrevious>
        <StepperNext>Continue</StepperNext>
      </div>
    </Stepper>
  </div>;
}

function Note({ position, children }: { position: string; children: string }) {
  return <span aria-hidden="true" data-doc-note={position} className="font-mono">{children}</span>;
}

function Anatomy() {
  return <div className="identity-docs-anatomy">
    <div className="flex items-center justify-end">
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" id="docs-annotations" defaultChecked className="size-4 accent-[#bd171c]"/>
        Show anatomy
      </label>
    </div>
    <div style={neutral} className="rounded-lg border border-[#242424]/15 bg-white px-3 py-8 text-foreground sm:px-8 sm:py-10">
      <Stepper steps={steps} defaultValue="details" className="mx-auto max-w-md gap-5 pt-6 pb-5">
        <StepperList aria-label="Component anatomy" className="mb-9">
          {steps.map(({value},index)=><StepperItem key={value} value={value} defaultTrigger={false} separator={false} completed={index===0}>
            <StepperTrigger data-doc-target={index===1?"":undefined}>
              <StepperIndicator data-doc-target={index===0?"":undefined}/>
              <StepperLabel data-doc-target={index===2?"":undefined}>{["Account","Details","Review"][index]}</StepperLabel>
            </StepperTrigger>
            {index<2 && <StepperSeparator/>}
            {index===0&&<><Note position="top">Indicator</Note><Note position="connector">Connector</Note></>}
            {index===1&&<Note position="top">Trigger</Note>}
            {index===2&&<Note position="bottom">Label</Note>}
          </StepperItem>)}
        </StepperList>
        <div className="relative">
          {steps.map(({value},index)=><StepperContent key={value} value={value} data-doc-target="" className="min-h-16">{["Account content","Details content","Review content"][index]}</StepperContent>)}
          <span className="absolute -top-3 right-2 rounded-sm bg-white px-1 font-mono text-[11px] text-[#bd171c]" data-doc-note="content" aria-hidden="true">Panel</span>
        </div>
        <div className="relative flex justify-between gap-2" data-doc-target="">
          <StepperPrevious>Back</StepperPrevious><StepperNext>Continue</StepperNext>
          <Note position="bottom">Navigation</Note>
        </div>
      </Stepper>
    </div>
    <dl className="mt-4 grid gap-0 sm:grid-cols-2">
      {[
        ["StepperIndicator","Number or status symbol."],
        ["StepperTrigger","Interactive hit area, not the focus outline."],
        ["StepperLabel","Visible name of the step."],
        ["StepperSeparator","Track and Fill between steps."],
        ["StepperContent","Panel for the active value."],
        ["StepperPrevious / Next","Navigation controls."],
      ].map(([name,meaning])=><div key={name} className="min-w-0 border-b border-[#bd171c]/20 py-3 sm:pr-4"><dt className="break-words font-mono text-xs font-medium text-[#bd171c]">{name}</dt><dd className="mt-1 text-sm leading-relaxed">{meaning}</dd></div>)}
    </dl>
  </div>;
}

type Prop = { name: string; type: string; description: string; defaultValue?: string };
function Props({ title, rows }: { title: string; rows: readonly Prop[] }) {
  return <div className="mt-6">
    <h3 className="text-lg font-medium">{title}</h3>
    <dl className="mt-2">
      {rows.map(row=><div key={row.name} className="grid min-w-0 gap-2 border-t border-[#242424]/15 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-5">
        <dt className="min-w-0"><code className="break-words font-mono text-sm font-medium text-[#bd171c]">{row.name}</code><span className="mt-1 block break-words font-mono text-xs text-[#555]">{row.type}</span>{row.defaultValue&&<span className="mt-1 block text-xs text-[#555]">Default: {row.defaultValue}</span>}</dt>
        <dd className="text-sm leading-relaxed">{row.description}</dd>
      </div>)}
    </dl>
  </div>;
}

export default function IdentityDocs() {
  return <main className="min-h-dvh bg-[#f2efeb] text-[#242424] selection:bg-[#bd171c] selection:text-white" style={{colorScheme:"light"}}>
    <style>{style}</style>
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14">
      <header className={"flex flex-wrap items-center justify-between gap-3 border-b py-4 "+rule}>
        <Link href="/drafts/identity" className={"flex items-center gap-2.5 rounded-sm "+focus}><Mark/><span className="text-xl font-semibold tracking-tight">Stepper</span></Link>
        <nav aria-label="Project navigation" className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/drafts/identity" className={"inline-flex min-h-11 items-center gap-1.5 hover:text-[#bd171c] "+focus}><ArrowLeft aria-hidden="true" className="size-4"/>Home</Link>
          <Link href="/docs" className={"inline-flex min-h-11 items-center gap-1.5 hover:text-[#bd171c] "+focus}>Current docs <ArrowUpRight aria-hidden="true" className="size-4"/></Link>
        </nav>
      </header>
      <div className="grid min-w-0 gap-0 lg:grid-cols-[180px_minmax(0,1fr)_148px] lg:gap-8">
        <aside className={"border-b py-4 lg:border-r lg:border-b-0 lg:py-10 lg:pr-5 "+rule}>
          <nav aria-label="Documentation" className="flex flex-wrap gap-x-4 gap-y-1 lg:sticky lg:top-8 lg:flex-col lg:gap-1">
            <span className="hidden pb-3 text-sm font-medium text-[#bd171c] lg:block">Getting started</span>
            {sections.map(section=><a key={section.id} href={"#"+section.id} className={"flex min-h-10 items-center rounded-sm text-sm hover:text-[#bd171c] hover:underline "+focus}>{section.label}</a>)}
          </nav>
        </aside>
        <article className="min-w-0 py-9 sm:py-12">
          <h1 className={serif+" text-[clamp(2.8rem,6vw,5rem)] leading-[.95] text-[#bd171c]"}>Build your first flow.</h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed">Stepper handles progress and navigation. Your application owns forms, validation, routing and business rules.</p>
          <section id="installation" className={"mt-10 scroll-mt-8 border-t pt-7 "+rule}>
            <h2 className={heading}>Installation</h2>
            <p className="mt-3 leading-relaxed">Run the shadcn CLI in an initialized shadcn project using Node.js 22 or newer.</p>
            <Install/>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><FileCode2 aria-hidden="true" className="size-4 text-[#bd171c]"/><code className="break-all font-mono">components/ui/stepper.tsx</code><span className="text-[#555]">— source copied into your app.</span></div>
          </section>
          <section id="example" className={"mt-10 scroll-mt-8 border-t pt-7 "+rule}>
            <h2 className={heading}>First component</h2>
            <p className="mt-3 leading-relaxed">Select any step or use Back and Continue. Each panel is linked to its step by value.</p>
            <div className="mt-5 grid min-w-0 gap-3"><Example/><Code code={exampleCode} file="account-setup.tsx"/></div>
          </section>
          <section id="anatomy" className={"mt-10 scroll-mt-8 border-t pt-7 "+rule}>
            <h2 className={heading}>Anatomy</h2>
            <p className="mt-3 leading-relaxed">The same primitives are available when you need to compose your own trigger or connector.</p>
            <Anatomy/>
          </section>
          <section id="control" className={"mt-10 scroll-mt-8 border-t pt-7 "+rule}>
            <h2 className={heading}>Controlled state</h2>
            <p className="mt-3 leading-relaxed">Use defaultValue for local navigation. Pass value and onValueChange when your application decides which step is active.</p>
            <div className="mt-5"><Code code={controlledSnippet} file="controlled-usage.tsx"/></div>
          </section>
          <section id="api" className={"mt-10 scroll-mt-8 border-t pt-7 "+rule}>
            <h2 className={heading}>API reference</h2>
            <Props title="Stepper" rows={rootProps}/>
            <Props title="StepperItem" rows={itemProps}/>
            <Link href="/docs/api" className={"mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#bd171c] hover:underline "+focus}>Full API reference <ArrowRight aria-hidden="true" className="size-4"/></Link>
          </section>
          <footer className={"mt-10 flex flex-wrap justify-between gap-3 border-t pt-5 "+rule}>
            <Link href="/drafts/identity" className={"text-sm font-medium text-[#bd171c] "+focus}>Return to Stepper</Link>
            <a href="https://github.com/francozeta/stepper" className={"text-sm font-medium text-[#bd171c] "+focus}>View source</a>
          </footer>
        </article>
        <aside className="hidden py-12 xl:block">
          <div className="sticky top-8">
            <p className="text-sm font-medium text-[#bd171c]">In this guide</p>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">From installation to composition.</p>
            <Link href="/drafts/identity#composition" className={"mt-5 inline-flex items-center gap-1.5 text-sm font-medium hover:text-[#bd171c] "+focus}>Explore states <ArrowUpRight aria-hidden="true" className="size-4 shrink-0"/></Link>
          </div>
        </aside>
      </div>
    </div>
  </main>;
}
