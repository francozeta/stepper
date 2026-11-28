import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, FlaskConical, Layers, ListChecks, ShoppingBag, UserRoundPlus } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { registryInstallSnippet } from "@/lib/docs";
import Link from "next/link";
import {
  Stepper, StepperContent, StepperItem, StepperList,
  StepperNext, StepperPrevious,
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
const parts = [
  ["Indicator", "The visible state of each step."],
  ["Trigger", "The actual interactive hit area."],
  ["Fill", "The completed portion of the connector."],
  ["Track", "The full connector path."],
  ["Content", "The panel associated with a step."],
] as const;

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
  return <div className="relative">
    <input id="show-anatomy" type="checkbox" defaultChecked className="peer sr-only"/>
    <label htmlFor="show-anatomy" className="mb-5 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[#bd171c]/50 px-3 text-sm text-[#bd171c] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:bg-[#bd171c] peer-checked:text-white"><Layers aria-hidden="true" className="size-4 shrink-0"/> Show anatomy</label>
    <div style={neutral} className="relative rounded-xl border border-border bg-background px-3 pt-16 pb-14 text-foreground sm:px-6">
      <Stepper steps={stages} defaultValue="details" className="gap-4">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="details">Details</StepperItem>
          <StepperItem value="confirm">Confirm</StepperItem>
        </StepperList>
        <div className="min-h-16 rounded-md border border-border p-3 text-xs text-muted-foreground">
          <StepperContent value="account" className="border-0 bg-transparent p-0 shadow-none">Account information</StepperContent>
          <StepperContent value="details" className="border-0 bg-transparent p-0 shadow-none">Preferences and details</StepperContent>
          <StepperContent value="confirm" className="border-0 bg-transparent p-0 shadow-none">Review your information</StepperContent>
        </div>
      </Stepper>
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-14 bottom-0 hidden text-[#bd171c] peer-checked:block">
      <div className="absolute inset-x-3 top-1 bottom-2 border border-dashed border-[#bd171c]/40"/>
      <div className="absolute top-5 left-[8%] border border-[#bd171c] bg-[#f2efeb] px-1.5 py-0.5 font-mono text-[9px]">INDICATOR<span className="absolute top-full left-1/2 h-6 border-l border-dashed border-[#bd171c]"/></div>
      <div className="absolute top-5 left-[42%] border border-[#bd171c] bg-[#f2efeb] px-1.5 py-0.5 font-mono text-[9px]">TRIGGER<span className="absolute top-full left-1/2 h-6 border-l border-dashed border-[#bd171c]"/></div>
      <div className="absolute top-[112px] left-[23%] bg-[#f2efeb] px-1 font-mono text-[9px]">FILL</div>
      <div className="absolute top-[112px] right-[23%] bg-[#f2efeb] px-1 font-mono text-[9px]">TRACK</div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 border border-[#bd171c] bg-[#f2efeb] px-2 py-0.5 font-mono text-[9px]">CONTENT</div>
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
      <section className={`grid gap-8 border-b py-10 lg:grid-cols-2 lg:gap-12 ${rule}`}>
        <div className="min-w-0"><Anatomy/></div>
        <div className="lg:border-l lg:border-[#bd171c]/35 lg:pl-12">
          <h2 className={`${serif} mt-2 text-6xl text-[#bd171c]`}>Anatomy.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed">Compose each part independently. Change the appearance without changing how your flow works.</p>
          <dl className="mt-5 grid gap-2.5 text-sm">{parts.map(([name,desc],i)=><div key={name} className="grid grid-cols-[2ch_9ch_1fr] gap-3"><span aria-hidden="true" className="font-mono text-xs text-[#bd171c]">{String(i+1).padStart(2,"0")}</span><dt className="font-medium text-[#bd171c]">{name}</dt><dd>{desc}</dd></div>)}</dl>
        </div>
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
