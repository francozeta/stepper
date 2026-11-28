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
  title: "Identity study 001",
  description: "Expressive by identity. Neutral by design.",
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
const anatomyParts = [
  { id: "root", name: "Stepper", detail: "Shares the current step and navigation state.", slot: "stepper" },
  { id: "list", name: "StepperList", detail: "Groups the steps in their navigation order.", slot: "stepper-list" },
  { id: "item", name: "StepperItem", detail: "Represents one stage and its state.", slot: "stepper-item" },
  { id: "trigger", name: "StepperTrigger", detail: "Selects a step; supports keyboard navigation.", slot: "stepper-trigger" },
  { id: "indicator", name: "StepperIndicator", detail: "Shows a number, completion mark or error.", slot: "stepper-indicator" },
  { id: "label", name: "StepperLabel", detail: "Names the stage for the person using it.", slot: "stepper-label" },
  { id: "separator", name: "StepperSeparator", detail: "Track and fill connect stages and express progress.", slot: "stepper-separator" },
  { id: "content", name: "StepperContent", detail: "Displays the panel for the active stage.", slot: "stepper-content" },
  { id: "navigation", name: "StepperPrevious / Next", detail: "Moves to the previous or next enabled stage.", slot: "stepper-next" },
] as const;

const anatomyCode = `<Stepper defaultValue="details">
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
</Stepper>`;

const inspectorStyles = `
  .identity-inspector:not(:has(#inspect-code:checked)) [data-inspector-code],
  .identity-inspector:has(#inspect-code:checked) [data-inspector-live],
  .identity-inspector:not(:has(#inspect-anatomy:checked)) [data-inspector-parts] { display: none; }
  .identity-inspector:has(#inspect-anatomy:checked) [data-inspector-live] { background-image: radial-gradient(#bd171c20 .65px, transparent .65px); background-size: 12px 12px; }
  ${anatomyParts.filter(p=>p.id!=="navigation").map(p=>`.identity-inspector:has(#inspect-anatomy:checked):has(#part-${p.id}:checked) [data-inspector-component] [data-slot="${p.slot}"]:not([hidden]):not(:focus-visible) { outline: 1px solid #bd171c; outline-offset: -1px; }`).join("\n")}
  .identity-inspector:has(#inspect-anatomy:checked):has(#part-navigation:checked) [data-inspector-component] :is([data-slot="stepper-previous"],[data-slot="stepper-next"]):not(:focus-visible) { outline: 1px solid #bd171c; outline-offset: 3px; }
  .identity-inspector:has(#inspect-anatomy:checked):has(#part-separator:checked) [data-inspector-component] [data-slot="stepper-separator"] { outline: 2px solid #bd171c; outline-offset: 2px; }
  .identity-inspector:has(#inspect-anatomy:checked):has(#part-indicator:checked) [data-inspector-component] [data-slot="stepper-indicator"],
  .identity-inspector:has(#inspect-anatomy:checked):has(#part-label:checked) [data-inspector-component] [data-slot="stepper-label"] { outline-offset: 3px; }
`;

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
        <span className="flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-[#555] peer-checked:bg-[#242424] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#bd171c]">{label}</span>
      </label>)}
    </fieldset>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <div className="min-w-0">
        <div data-inspector-live="" style={neutral} className="flex min-h-[340px] items-center justify-center rounded-xl border border-border bg-background p-4 text-foreground sm:p-10">
          <div data-inspector-component="" className="w-full max-w-lg rounded-lg bg-background p-2 sm:p-4">
            <Stepper steps={stages} defaultValue="details" className="gap-5">
              <StepperList aria-label="Anatomy example">
                {stages.map(({value},index)=><StepperItem key={value} value={value} defaultTrigger={false} separator={false}>
                  <StepperTrigger>
                    <StepperIndicator/>
                    <StepperLabel>{["Account","Details","Confirm"][index]}</StepperLabel>
                  </StepperTrigger>
                  {index<stages.length-1 && <StepperSeparator/>}
                </StepperItem>)}
              </StepperList>
              <div className="min-h-[76px]">
                {([{value:"account",text:"Account information"},{value:"details",text:"Preferences and details"},{value:"confirm",text:"Review your information"}] as const).map(({value,text})=><StepperContent key={value} value={value} className="min-h-[76px] rounded-lg border border-border bg-muted/25 p-4 shadow-none"><p className="text-sm font-medium">{text}</p></StepperContent>)}
              </div>
              <div className="flex justify-between gap-3">
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
          <pre tabIndex={0} className="max-h-[520px] overflow-auto p-4 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-[#bd171c] sm:text-sm"><code>{anatomyCode}</code></pre>
        </div>
      </div>
      <fieldset data-inspector-parts="" className="min-w-0 border-t border-[#bd171c]/35">
        <legend className="sr-only">Inspect a component part</legend>
        {anatomyParts.map(({id,name,detail},i)=><label key={id} className="relative block cursor-pointer border-b border-[#bd171c]/20">
          <input id={"part-"+id} type="radio" name="inspector-part" defaultChecked={id==="trigger"} className="peer sr-only"/>
          <span className="grid grid-cols-[2ch_minmax(0,1fr)_1rem] items-center gap-x-3 px-3 py-3 text-sm peer-checked:bg-[#bd171c]/[.055] peer-checked:text-[#bd171c] peer-focus-visible:outline-2 peer-focus-visible:outline-[#bd171c]">
            <span aria-hidden="true" className="font-mono text-xs tabular-nums text-[#bd171c]">{String(i+1).padStart(2,"0")}</span>
            <span className="break-words font-mono text-[13px] font-medium sm:text-sm">{name}</span>
            <ArrowRight aria-hidden="true" className="size-4"/>
          </span>
          <span className="hidden px-3 pt-0 pb-4 pl-[calc(2ch+1.5rem)] text-sm leading-relaxed text-[#555] peer-checked:block peer-checked:bg-[#bd171c]/[.055]">{detail}</span>
        </label>)}
      </fieldset>
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
        <div className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-8 -z-10 h-[75%] w-[55%] opacity-10" style={{background:"repeating-linear-gradient(135deg,#bd171c 0 1px,transparent 1px 5px)",clipPath:"polygon(0 100%,0 70%,33% 70%,33% 38%,66% 38%,66% 0,100% 0,100% 100%)"}}/>
          <h1 className={`${serif} text-[clamp(3.15rem,7vw,7.25rem)] leading-[.86] text-[#bd171c]`}>Make progress<br/>feel <em className="font-normal">natural.</em></h1>
          <p className="mt-7 max-w-[37ch] text-base leading-relaxed sm:text-lg">Build multi-step experiences for React, from onboarding to checkout. Stepper handles progress and navigation. You own the workflow.</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link href="/docs" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#bd171c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a20e14]">Get started <ArrowRight aria-hidden="true" className="size-4 shrink-0"/></Link>
            <a href="https://github.com/francozeta/stepper" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#242424]/30 px-5 py-2.5 text-sm hover:border-[#bd171c]">View source <ArrowUpRight aria-hidden="true" className="size-4 shrink-0"/></a>
          </div>
          <div style={neutral} className="mt-5 flex max-w-lg items-center gap-2 rounded-lg border border-[#242424]/15 bg-white/65 py-1.5 pr-1.5 pl-3 text-foreground">
            <Code2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground"/>
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs sm:text-sm">{registryInstallSnippet}</code>
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
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed">Explore how the parts fit together. Select a component to reveal its role in the live example.</p>
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
