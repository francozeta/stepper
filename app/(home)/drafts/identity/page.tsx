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
  title: "Identity study 008",
  description: "A composable React stepper for onboarding, checkout and multi-step forms.",
  robots: { index: false, follow: false },
};

const paper = "#f2efeb";
const neutral = {
  "--background": "#fff", "--foreground": "#222", "--primary": "#272727",
  "--primary-foreground": "#fff", "--muted": "#f4f4f4",
  "--muted-foreground": "#626262", "--border": "#d4d4d4",
  "--ring": "#555", "--input": "#d4d4d4",
  "--destructive": "#b91c1c", "--destructive-foreground": "#fff", colorScheme: "light",
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

const markPath = "M5 34h13V23h13V12h12v24H30v7H5z";

function Mark({ className = "", construction = false }: {className?: string; construction?: boolean}) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
    <path d={markPath} fill="currentColor"/>
    {construction && <path d="M5 43V34h13V23h13V12h12M1 34h46M18 5v42M31 5v42" stroke="currentColor" strokeWidth=".65" opacity=".45"/>}
    <path d="M11 39h7m6-11h7m6-11h6" stroke={paper} strokeWidth="1.2"/>
  </svg>;
}

const markStyles = `
  .identity-mark [data-mark-fill] {
    transform-box: fill-box;
    transform-origin: left center;
    transform: scaleX(1);
    transition: transform 260ms cubic-bezier(.2,.8,.2,1);
  }
  .identity-mark:has([data-slot="stepper-trigger"][aria-current="step"][data-mark-stage="account"]) [data-mark-fill] { transform: scaleX(.3421052632); }
  .identity-mark:has([data-slot="stepper-trigger"][aria-current="step"][data-mark-stage="details"]) [data-mark-fill] { transform: scaleX(.6842105263); }
  .identity-mark:has([data-slot="stepper-trigger"][aria-current="step"][data-mark-stage="confirm"]) [data-mark-fill] { transform: scaleX(1); }
  .identity-mark:not(:has(#identity-mark-grid:checked)) [data-mark-grid] { visibility: hidden; }
  @media (prefers-reduced-motion: reduce) {
    .identity-mark [data-mark-fill] { transition: none; }
  }
`;

function MarkStudy() {
  return (
    <div className="identity-mark min-w-0">
      <style>{markStyles}</style>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-medium tracking-tight">A mark in motion.</h3>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[#555]">
          <input type="checkbox" id="identity-mark-grid" defaultChecked className="size-4 accent-[#bd171c]"/>
          Construction
        </label>
      </div>
      <div style={neutral} className="mt-3 rounded-xl border border-border bg-background p-4 text-foreground sm:p-6">
        <Stepper steps={stages} defaultValue="confirm" className="gap-6">
          <div className="grid min-w-0 place-items-center overflow-hidden rounded-lg bg-[#f2efeb] py-5">
            <svg viewBox="0 0 180 132" className="h-[156px] w-full max-w-[260px] text-[#bd171c]" aria-hidden="true">
              <g data-mark-grid="" stroke="currentColor" strokeWidth=".6" opacity=".35" fill="none">
                {[42,68,94,118].map(x=><path key={x} d={"M"+x+" 12V112"}/>)}
                {[30,52,74,92].map(y=><path key={y} d={"M26 "+y+"H136"}/>)}
                <path d="M26 105h110m-110-4v8m110-8v8" strokeDasharray="2 2"/>
              </g>
              <g transform="translate(32 6) scale(2)">
                <defs><clipPath id="identity-mark-reveal"><rect data-mark-fill="" x="5" y="12" width="38" height="31"/></clipPath></defs>
                <path d={markPath} fill="currentColor" opacity=".10"/>
                <path d={markPath} fill="currentColor" clipPath="url(#identity-mark-reveal)"/>
                <path d={markPath} stroke="currentColor" strokeWidth=".45" strokeLinejoin="round"/>
                <path d="M11 39h7m6-11h7m6-11h6" stroke={paper} strokeWidth="1.2"/>
              </g>
              <g data-mark-grid="" fill="currentColor" fontSize="8" fontFamily="monospace">
                <text x="42" y="121">01</text><text x="68" y="121">02</text><text x="94" y="121">03</text>
              </g>
            </svg>
          </div>
          <StepperList aria-label="Logo progress" className="min-w-0 [&>li]:min-w-0">
            {stages.map(({value},index)=><StepperItem key={value} value={value} defaultTrigger={false}>
              <StepperTrigger data-mark-stage={value}><StepperIndicator/><StepperLabel>{["Start","Build","Complete"][index]}</StepperLabel></StepperTrigger>
            </StepperItem>)}
          </StepperList>
        </Stepper>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#555]">Move between steps to reveal the mark. The transition can reverse at any point.</p>
    </div>
  );
}

function MarkSizes() {
  return <div className="min-w-0">
    <h3 className="flex min-h-11 items-center text-xl font-medium tracking-tight">At every scale.</h3>
    <div className="mt-3 grid min-h-[300px] grid-rows-[1fr_auto] overflow-hidden rounded-xl border border-[#242424]/15 bg-white">
      <div className="grid grid-cols-2">
        <div className="grid place-items-center bg-[#bd171c] text-white">
          <svg viewBox="0 0 48 48" aria-hidden="true" className="size-20 sm:size-24"><path d={markPath} fill="currentColor"/></svg>
        </div>
        <div className="grid place-items-center bg-[#f2efeb] text-[#bd171c]"><Mark className="size-20 sm:size-24"/></div>
      </div>
      <div className="grid grid-cols-3 border-t border-[#242424]/15">
        {[16,24,40].map(size=><div key={size} className="grid min-h-[104px] grid-rows-[48px_auto] place-items-center border-r border-[#242424]/10 px-2 py-3 last:border-r-0">
          <svg viewBox="0 0 48 48" aria-hidden="true" style={{width:size,height:size}} className="text-[#242424]"><path d={markPath} fill="currentColor"/>{size!==16&&<path d="M11 39h7m6-11h7m6-11h6" stroke="white" strokeWidth="1.2"/>}</svg>
          <span className="font-mono text-xs text-[#555]">{size}px</span>
        </div>)}
      </div>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-[#555]">A simplified silhouette for small surfaces. The proposed mark is not yet the official logo.</p>
  </div>;
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

const stateSteps = [
  {value:"account"},
  {value:"details"},
  {value:"review"},
  {value:"payment"},
  {value:"finish", disabled:true},
] as const;

const stateNames = ["completed","active","inactive","error","disabled"] as const;

const variationStyles = `
  .identity-states [data-state-label] { display: none; }
  ${stateNames.map(state=>`.identity-states [data-slot="stepper-item"][data-state="${state}"] [data-state-label="${state}"] { display: inline; }`).join("\n")}
  .identity-variants:has(#identity-style-outline:checked) [data-slot="stepper-indicator"] {
    background: var(--background);
    box-shadow: none;
  }
  .identity-variants:has(#identity-style-outline:checked) [data-slot="stepper-item"]:is([data-state="active"],[data-state="completed"]) [data-slot="stepper-indicator"] {
    color: var(--primary);
    border-color: var(--primary);
    border-width: 2px;
  }
  .identity-variants:has(#identity-style-outline:checked) [data-slot="stepper-item"][data-state="active"] [data-slot="stepper-indicator"] {
    box-shadow: 0 0 0 3px #27272718;
  }
  .identity-variants:has(#identity-style-editorial:checked) [data-variant-flow] {
    --primary: #bd171c;
    --primary-foreground: #fff;
    --ring: #bd171c;
  }
  .identity-variants:has(#identity-style-editorial:checked) [data-slot="stepper-indicator"] {
    border-radius: 2px;
    box-shadow: none;
    font-family: var(--font-geist-mono), monospace;
  }
  .identity-variants:has(#identity-style-editorial:checked) [data-slot="stepper-label"] {
    font-family: var(--font-geist-mono), monospace;
  }
  .identity-variants:has(#identity-style-editorial:checked) [data-slot="stepper-item"]:is([data-state="active"],[data-state="completed"]) [data-slot="stepper-trigger"] {
    color: var(--primary);
  }
  .identity-variants:has(#identity-style-editorial:checked) [data-slot="stepper-next"],
  .identity-variants:has(#identity-style-editorial:checked) [data-slot="stepper-previous"] {
    border-radius: 2px;
  }
`;

function StateStudy() {
  return (
    <div className="identity-states min-w-0">
      <h3 className="text-xl font-medium tracking-tight">State</h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[#555]">Try the steps. Completion, errors and availability belong to your application.</p>
      <div style={neutral} className="mt-5 flex min-h-[232px] items-center rounded-xl border border-border bg-background px-2 py-6 text-foreground sm:px-5">
        <Stepper steps={stateSteps} defaultValue="details" className="w-full min-w-0 gap-5">
          <StepperList aria-label="Explore step states" className="min-w-0 [&>li]:min-w-[3.6rem] sm:[&>li]:min-w-[4rem]">
            {stateSteps.map(({value},index)=>(
              <StepperItem key={value} value={value} completed={value==="account"} error={value==="payment"} defaultTrigger={false} className="min-w-0">
                <StepperTrigger className="min-w-0 gap-2.5">
                  <StepperIndicator/>
                  <StepperLabel className="text-[10px] leading-4 sm:text-xs">
                    {stateNames.map(state=><span key={state} data-state-label={state} className="capitalize">{state}</span>)}
                  </StepperLabel>
                  <span className="sr-only">, {["Account","Details","Review","Payment","Finish"][index]}</span>
                </StepperTrigger>
              </StepperItem>
            ))}
          </StepperList>
          <div className="min-h-[48px] border-t border-border pt-3 text-center text-sm">
            <StepperContent value="account" className="border-0 bg-transparent p-0 shadow-none">Account already completed.</StepperContent>
            <StepperContent value="details" className="border-0 bg-transparent p-0 shadow-none">Details is the current step.</StepperContent>
            <StepperContent value="review" className="border-0 bg-transparent p-0 shadow-none">Review is now the current step.</StepperContent>
            <StepperContent value="payment" className="border-0 bg-transparent p-0 shadow-none">Payment has an error set by the app.</StepperContent>
          </div>
        </Stepper>
      </div>
    </div>
  );
}

function VariationStudy() {
  return (
    <div className="identity-variants min-w-0">
      <h3 className="text-xl font-medium tracking-tight">Appearance</h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[#555]">Switch the appearance at any step. Navigation and progress stay intact.</p>
      <div style={neutral} className="mt-5 flex min-h-[232px] flex-col justify-center rounded-xl border border-border bg-background px-3 py-4 text-foreground sm:px-5">
        <fieldset className="mx-auto flex w-fit max-w-full items-center gap-0.5 rounded-full border border-border bg-muted/50 p-1">
          <legend className="sr-only">Stepper appearance</legend>
          {([{id:"minimal",label:"Minimal"},{id:"outline",label:"Outline"},{id:"editorial",label:"Editorial"}] as const).map(({id,label})=>(
            <label key={id} className="relative cursor-pointer">
              <input type="radio" name="identity-style" id={"identity-style-"+id} defaultChecked={id==="minimal"} className="peer sr-only"/>
              <span className="flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring sm:text-sm">{label}</span>
            </label>
          ))}
        </fieldset>
        <div data-variant-flow="" className="mt-5">
          <Stepper steps={stages} defaultValue="details" className="gap-4">
            <StepperList aria-label="Style example" className="min-w-0 [&>li]:min-w-0">
              <StepperItem value="account" completed>Account</StepperItem>
              <StepperItem value="details">Details</StepperItem>
              <StepperItem value="confirm">Confirm</StepperItem>
            </StepperList>
            <div className="flex justify-between gap-2 border-t border-border pt-3">
              <StepperPrevious className="rounded-full">Back</StepperPrevious>
              <StepperNext className="rounded-full">Continue</StepperNext>
            </div>
          </Stepper>
        </div>
      </div>
    </div>
  );
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
      <section id="composition" className={`border-b py-10 lg:py-14 ${rule}`}>
        <style>{variationStyles}</style>
        <h2 className={`${serif} text-5xl text-[#bd171c] sm:text-6xl`}>Same behavior. Your design.</h2>
        <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
          <StateStudy/>
          <VariationStudy/>
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
      <section id="identity" className={`border-b py-10 lg:py-14 ${rule}`}>
        <h2 className={`${serif} text-5xl text-[#bd171c] sm:text-6xl`}>Progress, in its form.</h2>
        <div className="mt-7 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
          <MarkStudy/>
          <MarkSizes/>
        </div>
      </section>
      <footer className="flex flex-wrap items-end justify-between gap-5 py-8">
        <p className={`${serif} text-3xl italic text-[#bd171c] sm:text-4xl`}>Expressive by identity.<br/>Neutral by design.</p>
        <a href="https://github.com/francozeta" className="text-sm hover:text-[#bd171c]">By francozeta</a>
      </footer>
    </div>
  </main>;
}
