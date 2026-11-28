import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, FlaskConical, Layers, ListChecks, ShoppingBag, UserRoundPlus } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { registryInstallSnippet } from "@/lib/docs";
import Link from "next/link";
import {
  Stepper, StepperContent, StepperItem, StepperList,
  StepperNext, StepperPrevious, StepperTrigger, StepperIndicator, StepperLabel, StepperSeparator,
} from "@/components/ui/stepper";

export const metadata: Metadata = {
  title: "Identity study 006",
  description: "A composable React stepper for onboarding, checkout and multi-step forms.",
  robots: { index: false, follow: false },
};

const paper = "#f2efeb";
const neutral = {
  "--background": "#fff", "--foreground": "#222", "--primary": "#272727",
  "--primary-foreground": "#fff", "--muted": "#f4f4f4",
  "--muted-foreground": "#626262", "--border": "#d4d4d4",
  "--ring": "#555", "--input": "#d4d4d4",
  "--destructive": "#b91c1c", colorScheme: "light",
} as CSSProperties;
const serif = "[font-family:Georgia,'Times_New_Roman',serif] font-normal tracking-[-.055em]";
const rule = "border-[#bd171c]/35";
const field = "h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ";
const stages = [{value:"account"}, {value:"details"}, {value:"confirm"}] as const;
const anatomyCode = `import {
  Stepper, StepperList, StepperItem, StepperTrigger,
  StepperIndicator, StepperLabel, StepperSeparator,
  StepperContent, StepperPrevious, StepperNext,
} from "@/components/ui/stepper";

const steps = [
  { value: "account", label: "Account" },
  { value: "details", label: "Details" },
  { value: "confirm", label: "Confirm" },
];

export function Example() {
  return (
    <Stepper steps={steps} defaultValue="details">
      <StepperList>
        {steps.map(({ value, label }, index) => (
          <StepperItem key={value} value={value}
            defaultTrigger={false} separator={false}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>{label}</StepperLabel>
            </StepperTrigger>
            {index < steps.length - 1 && <StepperSeparator />}
          </StepperItem>
        ))}
      </StepperList>
      <StepperContent value="account">Account information</StepperContent>
      <StepperContent value="details">Preferences and details</StepperContent>
      <StepperContent value="confirm">Review your information</StepperContent>
      <StepperPrevious>Back</StepperPrevious>
      <StepperNext>Continue</StepperNext>
    </Stepper>
  );
}`;

const inspectorStyles = `
  .identity-inspector {
    --annotation: #bd171c;
  }
  .identity-inspector:not(:has(#inspect-code:checked)) [data-inspector-code],
  .identity-inspector:has(#inspect-code:checked) [data-inspector-live],
  .identity-inspector:not(:has(#inspect-anatomy:checked)) :is([data-anatomy-note], [data-anatomy-description]) {
    display: none;
  }
  .identity-inspector:has(#inspect-anatomy:checked) [data-inspector-live] {
    background-image: radial-gradient(#bd171c1a .65px, transparent .65px);
    background-size: 12px 12px;
  }
  /* Reserve annotation space in both modes to keep controls in place. */
  .identity-inspector [data-inspector-component] {
    padding-block: 36px 34px;
  }
  .identity-inspector [data-slot="stepper-list"] {
    overflow: visible;
    margin-bottom: 32px;
  }
  .identity-inspector [data-slot="stepper-item"] {
    min-width: 0;
  }
  .identity-inspector [data-anatomy-note] {
    position: absolute;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    pointer-events: none;
    font-family: var(--font-geist-mono), monospace;
    font-size: 11px;
    line-height: 1.3;
    padding: 2px 5px;
    color: var(--annotation);
    background: #fff;
    border: 1px solid #bd171c60;
    border-radius: 2px;
  }
  .identity-inspector [data-anatomy-note]::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 0;
    height: var(--leader);
    border-left: 1px solid #bd171cb3;
    transform: translateX(-.5px);
  }
  .identity-inspector [data-anatomy-note]::before {
    content: "";
    position: absolute;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--annotation);
    transform: translateX(-50%);
  }
  [data-anatomy-note="indicator"],
  [data-anatomy-note="trigger"] {
    --leader: 15px;
    bottom: calc(100% + 15px);
    left: 50%;
    transform: translateX(-50%);
  }
  [data-anatomy-note="indicator"]::after,
  [data-anatomy-note="trigger"]::after,
  [data-anatomy-note="content"]::after { top: 100%; }
  [data-anatomy-note="indicator"]::before,
  [data-anatomy-note="trigger"]::before,
  [data-anatomy-note="content"]::before {
    top: calc(100% + var(--leader) - 2px);
  }
  /* The midpoint between adjacent flex items follows the separator Y token. */
  [data-anatomy-note="connector"] {
    --leader: 48px;
    left: 100%;
    top: calc(var(--stepper-separator-y) + 48px);
    transform: translateX(-50%);
  }
  [data-anatomy-note="label"] {
    --leader: 12px;
    left: 50%;
    top: calc(100% + 12px);
    transform: translateX(-50%);
  }
  [data-anatomy-note="connector"]::after,
  [data-anatomy-note="label"]::after,
  [data-anatomy-note="navigation"]::after { bottom: 100%; }
  [data-anatomy-note="connector"]::before,
  [data-anatomy-note="label"]::before,
  [data-anatomy-note="navigation"]::before {
    bottom: calc(100% + var(--leader) - 2px);
  }
  [data-anatomy-note="content"] {
    --leader: 10px;
    right: 10px;
    bottom: calc(100% + 10px);
  }
  [data-anatomy-note="navigation"] {
    --leader: 12px;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
  }
  .identity-inspector:has(#inspect-anatomy:checked) [data-anatomy-target]:not(:focus-visible),
  .identity-inspector:has(#inspect-anatomy:checked) [data-slot="stepper-content"],
  .identity-inspector:has(#inspect-anatomy:checked) [data-anatomy-navigation] {
    outline: 1px solid #bd171c8a;
    outline-offset: 3px;
  }
  .identity-inspector:has(#inspect-anatomy:checked) [data-slot="stepper-trigger"][data-anatomy-target]:not(:focus-visible),
  .identity-inspector:has(#inspect-anatomy:checked) [data-anatomy-navigation] {
    outline-style: dashed;
  }
  @media (min-width: 640px) {
    .identity-inspector [data-anatomy-note] { font-size: 12px; padding-inline: 7px; }
  }
`;

function AnatomyNote({ part, children }: { part: string; children: string }) {
  return <span aria-hidden="true" data-anatomy-note={part}>{children}</span>;
}

function Mark({ className = "" }: {className?: string}) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
    <path d="M5 34h13V23h13V12h12v24H30v7H5z" fill="currentColor"/>
    <path d="M5 43V34h13V23h13V12h12M1 34h46M18 5v42M31 5v42" stroke="currentColor" strokeWidth=".65" opacity=".45"/>
    <path d="M11 39h7m6-11h7m6-11h6" stroke={paper} strokeWidth="1.2"/>
  </svg>;
}

function Demo() {
  return <div style={neutral} className="rounded-xl border border-border bg-background p-4 text-foreground sm:p-7">
    <Stepper steps={stages} defaultValue="account" className="gap-5">
      <StepperList>
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="confirm">Confirm</StepperItem>
      </StepperList>
      <div className="min-h-[168px]">
        <StepperContent value="account" keepMounted className="space-y-3 border-0 bg-transparent p-0 shadow-none">
          <h3 className="text-lg font-medium">Start with the essentials.</h3>
          <label className="grid gap-1.5 text-sm">Workspace name<input className={field} placeholder="Studio" autoComplete="organization"/></label>
          
        </StepperContent>
        <StepperContent value="details" keepMounted className="space-y-3 border-0 bg-transparent p-0 shadow-none">
          <h3 className="text-lg font-medium">Make it yours.</h3>
          <label className="grid gap-1.5 text-sm">Email address<input type="email" className={field} placeholder="you@example.com" autoComplete="email"/></label>
          
        </StepperContent>
        <StepperContent value="confirm" keepMounted className="space-y-3 border-0 bg-transparent p-0 shadow-none">
          <h3 className="text-lg font-medium">Everything in place.</h3>
          <p className="text-sm text-muted-foreground">Go back to edit your details. Nothing is submitted.</p>
        </StepperContent>
      </div>
      <div className="flex justify-between gap-3 border-t border-border pt-4">
        <StepperPrevious className="rounded-full">Back</StepperPrevious>
        <StepperNext className="rounded-full">Continue</StepperNext>
      </div>
    </Stepper>
  </div>;
}

function Anatomy() {
  return <div className="identity-inspector mt-7">
    <style>{inspectorStyles}</style>
    <fieldset className="mb-5 flex flex-wrap items-center gap-1 rounded-full border border-[#242424]/15 bg-white/40 p-1 w-fit">
      <legend className="sr-only">Component view</legend>
      {([{id:"preview", label:"Preview"}, {id:"anatomy", label:"Anatomy"}, {id:"code", label:"Code"}]).map(({id,label})=><label key={id} className="relative cursor-pointer">
        <input type="radio" name="inspector-view" id={"inspect-"+id} defaultChecked={id==="anatomy"} className="peer sr-only"/>
        <span className="flex h-10 items-center justify-center rounded-full px-3.5 text-sm font-medium text-[#555] peer-checked:bg-[#242424] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#bd171c]">{label}</span>
      </label>)}
    </fieldset>
    <div className="min-w-0">
      <div className="min-w-0">
        <div data-inspector-live="" style={neutral} className="flex min-h-[380px] items-center justify-center rounded-xl border border-border bg-background px-3 py-5 text-foreground sm:px-10 sm:py-6">
          <p data-anatomy-description="" className="sr-only">Indicator shows step state, Trigger selects a step, Label names it, Track and fill show progress, Content displays the active stage, and Navigation moves between enabled steps.</p>
          <div data-inspector-component="" className="w-full max-w-2xl rounded-lg bg-background px-1 sm:px-8">
            <Stepper steps={stages} defaultValue="details" className="gap-5">
              <StepperList aria-label="Anatomy example">
                {stages.map(({value},index)=><StepperItem key={value} value={value} defaultTrigger={false} separator={false}>
                  <StepperTrigger data-anatomy-target={index===1 ? "" : undefined}>
                    <StepperIndicator data-anatomy-target={index===0 ? "" : undefined}/>
                    <StepperLabel data-anatomy-target={index===2 ? "" : undefined}>{["Account","Details","Confirm"][index]}</StepperLabel>
                  </StepperTrigger>
                  {index<stages.length-1 && <StepperSeparator/>}
                  {index===0 && <><AnatomyNote part="indicator">Indicator</AnatomyNote><AnatomyNote part="connector">Track / fill</AnatomyNote></>}
                  {index===1 && <AnatomyNote part="trigger">Trigger</AnatomyNote>}
                  {index===2 && <AnatomyNote part="label">Label</AnatomyNote>}
                </StepperItem>)}
              </StepperList>
              <div className="relative min-h-[76px]">
                <AnatomyNote part="content">Content</AnatomyNote>
                {([{value:"account",text:"Account information"},{value:"details",text:"Preferences and details"},{value:"confirm",text:"Review your information"}] as const).map(({value,text})=><StepperContent key={value} value={value} className="min-h-[76px] rounded-lg border border-border bg-muted/25 p-4 shadow-none"><p className="text-sm font-medium">{text}</p></StepperContent>)}
              </div>
              <div data-anatomy-navigation="" className="relative flex justify-between gap-3">
                <AnatomyNote part="navigation">Navigation</AnatomyNote>
                <StepperPrevious className="rounded-full">Back</StepperPrevious>
                <StepperNext className="rounded-full">Continue</StepperNext>
              </div>
            </Stepper>
          </div>
        </div>
        <div data-inspector-code="" style={neutral} className="relative rounded-xl border border-border bg-background text-foreground">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm"><Code2 aria-hidden="true" className="size-4"/> JSX</span>
            <CopyButton value={anatomyCode} label="Copy JSX" iconOnly className="size-9"/>
          </div>
          <pre tabIndex={0} className="h-[325px] overflow-auto p-4 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-[#bd171c] sm:text-sm"><code>{anatomyCode}</code></pre>
        </div>
      </div>
    </div>
  </div>;
}

export default function IdentityStudy() {
  return <main className="min-h-dvh bg-[#f2efeb] text-[#242424] selection:bg-[#bd171c] selection:text-white" style={{colorScheme:"light"}}>
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14">
      <header className={`flex flex-wrap items-center justify-between gap-4 border-b py-5 ${rule}`}>
        <Link href="/drafts/identity" className="flex items-center gap-2.5">
          <Mark className="size-10 text-[#bd171c]"/>
          <span className="text-xl leading-none font-semibold tracking-tight">Stepper</span>
        </Link>
        <nav aria-label="Stepper" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <Link href="/docs" className="hover:text-[#bd171c]">Docs</Link>
          <Link href="/drafts/interactions" className="hover:text-[#bd171c]">Research</Link>
          <a href="https://github.com/francozeta/stepper" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#242424]/30 px-3 py-1.5 hover:border-[#bd171c]">GitHub <ArrowUpRight aria-hidden="true" className="size-4 shrink-0"/></a>
        </nav>
      </header>
      <section className={`grid gap-10 border-b py-10 lg:grid-cols-[1.12fr_1fr] lg:items-center lg:gap-12 lg:py-16 ${rule}`}>
        <div className="relative isolate min-w-0">
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-8 -z-10 h-[75%] w-[55%] opacity-10" style={{background:"repeating-linear-gradient(135deg,#bd171c 0 1px,transparent 1px 5px)",clipPath:"polygon(0 100%,0 70%,33% 70%,33% 38%,66% 38%,66% 0,100% 0,100% 100%)"}}/>
          <h1 className={`${serif} text-[clamp(2.7rem,7vw,7.25rem)] leading-[.86] text-[#bd171c]`}>Make progress<br/>feel <em className="font-normal">natural.</em></h1>
          <p className="mt-7 max-w-[37ch] text-base leading-relaxed sm:text-lg"><strong className="font-medium">A composable stepper for React.</strong> Build onboarding, checkout and multi-step forms. Stepper handles progress and navigation; you own the workflow.</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link href="/docs/installation" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#bd171c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a20e14]">Get started <ArrowRight aria-hidden="true" className="size-4 shrink-0"/></Link>
            <a href="https://github.com/francozeta/stepper" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#242424]/30 px-5 py-2.5 text-sm hover:border-[#bd171c]">View source <ArrowUpRight aria-hidden="true" className="size-4 shrink-0"/></a>
          </div>
          <div style={neutral} className="mt-5 flex max-w-lg items-center gap-2 rounded-lg border border-[#242424]/15 bg-white/65 py-1.5 pr-1.5 pl-3 text-foreground">
            <Code2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground"/>
            <code className="min-w-0 flex-1 break-words font-mono text-xs leading-5 sm:text-sm">{registryInstallSnippet}</code>
            <CopyButton value={registryInstallSnippet} label="Copy install command" iconOnly className="size-9 shrink-0"/>
          </div>
        </div>
        <div className="min-w-0">
          <Demo/>
        </div>
      </section>
      <section id="anatomy" className={`border-b py-10 lg:py-14 ${rule}`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={`${serif} text-5xl text-[#bd171c] sm:text-6xl`}>Anatomy.</h2>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed">See the parts of a real Stepper. The indicator shows state, the trigger moves between steps, and the connector shows progress.</p>
          </div>
          <Link href="/docs/api" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#bd171c]">API reference <ArrowUpRight aria-hidden="true" className="size-4"/></Link>
        </div>
        <Anatomy/>
      </section>
      <section className={`border-b py-10 lg:py-14 ${rule}`}>
        <h2 className={`${serif} text-5xl text-[#bd171c] sm:text-6xl`}>Your flow. Your rules.</h2>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed">Install the source with shadcn, compose it in JSX, and style it to fit your product. Form state, validation and submission stay in your application.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {([
            {Icon:UserRoundPlus,title:"Onboarding",description:"Guide people through setup.",href:"/drafts/onboarding"},
            {Icon:ShoppingBag,title:"Checkout",description:"Show progress from details to confirmation.",href:"/docs"},
            {Icon:ListChecks,title:"Multi-step forms",description:"Break complex tasks into manageable steps.",href:"/drafts/interactions"},
          ]).map(({Icon,title,description,href})=><Link key={title} href={href} className="group flex items-start gap-3 border-t border-[#bd171c]/35 pt-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[#bd171c]/30 text-[#bd171c]"><Icon aria-hidden="true" className="size-5"/></span>
            <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2 font-medium">{title}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-[#bd171c]"/></span><span className="mt-1 block text-sm leading-relaxed text-[#555]">{description}</span></span>
          </Link>)}
        </div>
      </section>
      <section className={`flex flex-wrap gap-x-8 gap-y-4 border-b py-6 ${rule}`} aria-label="Explore Stepper">
        {([
          {Icon:BookOpen,title:"Documentation",href:"/docs"},
          {Icon:FlaskConical,title:"Research",href:"/drafts/interactions"},
          {Icon:Layers,title:"Handoff",href:"/drafts/handoff"},
        ]).map(({Icon,title,href})=><Link key={href} href={href} className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#bd171c]"><Icon aria-hidden="true" className="size-4 shrink-0 text-[#bd171c]"/>{title}<ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0"/></Link>)}
      </section>
      <footer className="flex flex-wrap items-end justify-between gap-5 py-8">
        <p className={`${serif} text-3xl italic text-[#bd171c] sm:text-4xl`}>Expressive by identity.<br/>Neutral by design.</p>
        <a href="https://github.com/francozeta" className="text-sm hover:text-[#bd171c]">By francozeta</a>
      </footer>
    </div>
  </main>;
}
