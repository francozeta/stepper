import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
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

const ink = "#bd171c";
const paper = "#f2efeb";
const neutral = {
  "--background": "#fff", "--foreground": "#222", "--primary": "#272727",
  "--primary-foreground": "#fff", "--muted": "#f4f4f4",
  "--muted-foreground": "#626262", "--border": "#d4d4d4",
  "--ring": "#555", "--input": "#d4d4d4",
  "--destructive": "#b91c1c", colorScheme: "light",
} as CSSProperties;
const figure = "font-mono text-[10px] font-medium uppercase tracking-[.13em] text-[#bd171c]";
const serif = "[font-family:Georgia,'Times_New_Roman',serif] font-normal tracking-[-.055em]";
const rule = "border-[#bd171c]/35";
const field = "h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm";
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
          <p className="text-xs text-muted-foreground">A place for your next idea.</p>
        </StepperContent>
        <StepperContent value="details" keepMounted className="space-y-3 border-0 bg-transparent p-0 shadow-none">
          <h3 className="text-lg font-medium">Make it yours.</h3>
          <label className="grid gap-1.5 text-sm">Email address<input type="email" className={field} placeholder="you@example.com" autoComplete="email"/></label>
          <p className="text-xs text-muted-foreground">Your input stays here as you navigate.</p>
        </StepperContent>
        <StepperContent value="confirm" keepMounted className="space-y-3 border-0 bg-transparent p-0 shadow-none">
          <h3 className="text-lg font-medium">Everything in place.</h3>
          <p className="text-sm text-muted-foreground">Go back to revisit your details. This demo does not submit or store any data.</p>
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
    <label htmlFor="show-anatomy" className="mb-5 inline-flex cursor-pointer rounded-full border border-[#bd171c]/50 px-3 py-1.5 font-mono text-[11px] text-[#bd171c] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:bg-[#bd171c] peer-checked:text-white">Anatomy overlay</label>
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
          <span className="grid"><span className="text-xl leading-none font-semibold tracking-tight">Stepper</span><span className="mt-1 font-mono text-[9px] uppercase tracking-[.2em]">by francozeta</span></span>
        </Link>
        <nav aria-label="Stepper" className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs">
          <Link href="/docs" className="hover:text-[#bd171c]">Docs</Link>
          <Link href="/drafts/interactions" className="hover:text-[#bd171c]">Research</Link>
          <Link href="/drafts/onboarding" className="hover:text-[#bd171c]">Onboarding</Link>
          <a href="https://github.com/francozeta/stepper" className="rounded-full border border-[#242424]/30 px-3 py-1.5 hover:border-[#bd171c]">GitHub ↗</a>
        </nav>
      </header>
      <section className={`grid gap-10 border-b py-10 lg:grid-cols-[1.12fr_1fr] lg:items-center lg:gap-12 lg:py-16 ${rule}`}>
        <div className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-8 -z-10 h-[75%] w-[55%] opacity-10" style={{background:"repeating-linear-gradient(135deg,#bd171c 0 1px,transparent 1px 5px)",clipPath:"polygon(0 100%,0 70%,33% 70%,33% 38%,66% 38%,66% 0,100% 0,100% 100%)"}}/>
          <p className={figure}>Fig. 01 / Identity study</p>
          <h1 className={`${serif} mt-5 text-[clamp(3.4rem,7.5vw,7.7rem)] leading-[.86] text-[#bd171c]`}>Make progress<br/>feel <em className="font-normal">natural.</em></h1>
          <p className={`${serif} mt-7 text-2xl italic tracking-[-.035em] sm:text-3xl`}>Expressive by identity.<br className="sm:hidden"/> Neutral by design.</p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed sm:text-base">A composable progress and navigation primitive for multi-step flows. Your application owns the workflow. Stepper makes it visible.</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link href="/docs" className="rounded-full bg-[#bd171c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a20e14]">Read the docs ↗</Link>
            <a href="https://github.com/francozeta/stepper" className="rounded-full border border-[#242424]/30 px-5 py-2.5 text-sm hover:border-[#bd171c]">View source ↗</a>
          </div>
        </div>
        <div className="min-w-0">
          <div className={`mb-3 flex justify-between ${figure}`}><span>Live component / Neutral</span><span>01</span></div>
          <Demo/>
          <p className="mt-3 font-mono text-[10px] text-[#626262]">Actual Stepper primitive. No brand tokens inherited.</p>
        </div>
      </section>
      <section className={`grid gap-8 border-b py-10 lg:grid-cols-2 lg:gap-12 ${rule}`}>
        <div className="min-w-0"><p className={`${figure} mb-4`}>Fig. 02 / Anatomy</p><Anatomy/></div>
        <div className="lg:border-l lg:border-[#bd171c]/35 lg:pl-12">
          <p className={figure}>Structure is a language.</p>
          <h2 className={`${serif} mt-2 text-6xl text-[#bd171c]`}>Anatomy.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed">A modular structure that separates progress, navigation and content. Reveal the construction without changing the component.</p>
          <dl className="mt-5 grid gap-2.5 text-sm">{parts.map(([name,desc],i)=><div key={name} className="grid grid-cols-[2ch_7ch_1fr] gap-3"><span aria-hidden="true" className="font-mono text-xs text-[#bd171c]">{String(i+1).padStart(2,"0")}</span><dt className="font-medium text-[#bd171c]">{name}</dt><dd>{desc}</dd></div>)}</dl>
        </div>
      </section>
      <section className={`grid gap-8 border-b py-9 md:grid-cols-[1fr_1fr] ${rule}`}>
        <div><p className={figure}>Fig. 03 / Mark exploration</p><h2 className={`${serif} mt-3 text-4xl`}>A mark for progress.</h2><p className="mt-3 max-w-md text-sm leading-relaxed">The original mark remains intact. This geometric candidate translates steps into a simpler construction for editorial surfaces and small sizes.</p></div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`grid place-items-center gap-3 border p-5 ${rule}`}><Image src="/stepper-logo.svg" alt="Current Stepper logo" width={64} height={64}/><span className="font-mono text-[10px] uppercase">Current</span></div>
          <div className={`grid place-items-center gap-3 border p-5 ${rule}`}><Mark className="size-16 text-[#bd171c]"/><span className={figure}>Candidate 01</span></div>
        </div>
      </section>
      <section className={`grid grid-cols-2 gap-px border-b py-8 sm:grid-cols-4 ${rule}`} aria-label="Explore Stepper">
        {([["Docs","API and usage","/docs"],["Research","Interaction studies","/drafts/interactions"],["Handoff","Shared intent","/drafts/handoff"],["Onboarding","Agent experiment","/drafts/onboarding"]] as const).map(([title,desc,href])=><Link key={href} href={href} className="group border border-[#bd171c]/30 p-4 hover:bg-[#bd171c]/5"><div className="flex justify-between gap-1 font-medium">{title}<span aria-hidden="true" className="text-[#bd171c]">↗</span></div><p className="mt-2 text-xs text-[#626262]">{desc}</p></Link>)}
      </section>
      <footer className="grid gap-5 py-9 md:grid-cols-2 md:items-end">
        <div><p className={figure}>Identity / Core</p><p className={`${serif} mt-3 text-3xl italic text-[#bd171c] sm:text-4xl`}>Identity for the project.<br/>Neutral for your product.</p></div>
        <div className="space-y-3 text-sm"><p className="max-w-md leading-relaxed">The visual language belongs to the website and documentation. The distributed component remains independently customizable.</p><p className="font-mono text-[10px] uppercase tracking-wider text-[#626262]">Stepper / Research / 001 — separate identity study</p></div>
      </footer>
    </div>
  </main>;
}
