import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import { StepperLogo } from "@/components/stepper-logo";
import { CodeBlockCommand } from "@/components/code-block-command";
import { CopyButton } from "@/components/copy-button";
import { registryInstallCommands } from "@/lib/docs";
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

const neutral = {
  "--background": "#fff", "--foreground": "#222", "--primary": "#272727",
  "--primary-foreground": "#fff", "--muted": "#f4f4f4",
  "--muted-foreground": "#626262", "--border": "#d4d4d4",
  "--ring": "#555", "--input": "#d4d4d4",
  "--destructive": "#b91c1c", colorScheme: "light",
} as CSSProperties;
const serif = "[font-family:Georgia,'Times_New_Roman',serif] font-normal tracking-[-.055em]";
const field = "h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ";
const stages = [{value:"account"}, {value:"details"}, {value:"confirm"}] as const;
const anatomyCode = `const steps = [
  { value: "account", label: "Account" },
  { value: "details", label: "Details" },
  { value: "confirm", label: "Confirm" },
];

<Stepper defaultValue="details">
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

const identityStyles = `
  .stepper-identity {
    --ink: #be151b;
    --paper: #eae8e5;
    --rule: #be151b70;
  }
  .identity-frame {
    border-inline: 1px solid var(--rule);
  }
  .identity-rule {
    position: relative;
    border-bottom: 1px solid var(--rule);
  }
  .identity-rule::after {
    content: "";
    position: absolute;
    width: 13px;
    bottom: -1px;
    left: -7px;
    border-bottom: 1px solid var(--ink);
    pointer-events: none;
  }
  .identity-rule::before {
    content: "";
    position: absolute;
    width: 13px;
    bottom: -1px;
    right: -7px;
    border-bottom: 1px solid var(--ink);
    pointer-events: none;
  }
  .identity-inspector:not(:has(#inspect-code:checked)) [data-inspector-code],
  .identity-inspector:has(#inspect-code:checked) [data-inspector-live],
  .identity-inspector:not(:has(#inspect-anatomy:checked)) :is([data-anatomy-note], [data-anatomy-description]) {
    display: none;
  }
  .identity-inspector [data-inspector-live] {
    --annotation: #be151b;
  }
  .identity-inspector:has(#inspect-anatomy:checked) [data-inspector-live] {
    background-image: linear-gradient(90deg, #be151b0a 1px, transparent 1px), linear-gradient(#be151b0a 1px, transparent 1px);
    background-size: 16px 16px;
  }
  .identity-inspector [data-inspector-component] {
    padding-block: 40px 38px;
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
    line-height: 1.2;
    padding: 3px 5px;
    color: var(--annotation);
    background: var(--paper);
    border: 1px solid #be151b80;
  }
  .identity-inspector [data-anatomy-note]::after {
    content: "";
    position: absolute;
    left: 50%;
    border-left: 1px dashed var(--annotation);
  }
  [data-anatomy-note="indicator"], [data-anatomy-note="trigger"] {
    left: 50%;
    top: -29px;
    transform: translateX(-50%);
  }
  [data-anatomy-note="indicator"]::after,
  [data-anatomy-note="trigger"]::after { top: 100%; height: 12px; }
  [data-anatomy-note="connector"] {
    left: 100%;
    top: calc(var(--stepper-separator-y) + 43px);
    transform: translateX(-50%);
  }
  [data-anatomy-note="connector"]::after { bottom: 100%; height: 42px; }
  [data-anatomy-note="label"] {
    left: 50%;
    top: calc(100% + 7px);
    transform: translateX(-50%);
  }
  [data-anatomy-note="label"]::after { bottom: 100%; height: 15px; }
  [data-anatomy-note="content"] { right: 9px; bottom: calc(100% + 7px); }
  [data-anatomy-note="content"]::after { top: 100%; height: 7px; }
  [data-anatomy-note="navigation"] {
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
  }
  [data-anatomy-note="navigation"]::after { bottom: 100%; height: 12px; }
  .identity-inspector:has(#inspect-anatomy:checked) [data-anatomy-target]:not(:focus-visible),
  .identity-inspector:has(#inspect-anatomy:checked) [data-slot="stepper-content"],
  .identity-inspector:has(#inspect-anatomy:checked) [data-anatomy-navigation] {
    outline: 1px dashed #be151ba0;
    outline-offset: 3px;
  }
  @media (min-width: 640px) {
    .identity-inspector [data-anatomy-note] { font-size: 12px; padding-inline: 8px; }
  }
`;

function AnatomyNote({ part, children }: { part: string; children: string }) {
  return <span aria-hidden="true" data-anatomy-note={part}>{children}</span>;
}

function Demo() {
  return <div style={neutral} className="min-w-0 border border-border bg-background p-4 text-foreground sm:p-7">
    <Stepper steps={stages} defaultValue="account" className="gap-5">
      <StepperList className="[&>li]:min-w-0">
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="confirm">Confirm</StepperItem>
      </StepperList>
      <div className="min-h-[124px]">
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
  return <div className="identity-inspector min-w-0">
    
    <fieldset className="flex items-center gap-0 border border-[#be151b]/50 w-fit">
      <legend className="sr-only">Component view</legend>
      {([{id:"preview", label:"Preview"}, {id:"anatomy", label:"Anatomy"}, {id:"code", label:"Code"}]).map(({id,label})=><label key={id} className="relative cursor-pointer">
        <input type="radio" name="inspector-view" id={"inspect-"+id} defaultChecked={id==="anatomy"} className="peer sr-only"/>
        <span className="flex h-10 items-center justify-center px-3.5 text-sm font-medium text-[#be151b] peer-checked:bg-[#be151b] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#bd171c]">{label}</span>
      </label>)}
    </fieldset>
    <div className="min-w-0">
      <div className="min-w-0">
        <div data-inspector-live="" style={neutral} className="flex min-h-[356px] items-center justify-center border border-[#be151b]/50 bg-background px-3 py-4 text-foreground sm:p-7">
          <p data-anatomy-description="" className="sr-only">Indicator shows step state, Trigger selects a step, Label names it, Track and fill show progress, Content displays the active stage, and Navigation moves between enabled steps.</p>
          <div data-inspector-component="" className="w-full max-w-xl px-1 sm:px-8">
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
        <div data-inspector-code="" style={neutral} className="relative border border-[#be151b]/50 bg-background text-foreground">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm"><Code2 aria-hidden="true" className="size-4"/> JSX</span>
            <CopyButton value={anatomyCode} label="Copy JSX" iconOnly className="size-9"/>
          </div>
          <pre tabIndex={0} className="max-h-[356px] min-h-[310px] overflow-auto p-4 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-[#bd171c] sm:text-sm"><code>{anatomyCode}</code></pre>
        </div>
      </div>
    </div>
  </div>;
}

const checkoutSteps = [{value:"bag"}, {value:"shipping"}, {value:"review"}] as const;
const setupSteps = [{value:"profile"}, {value:"preferences"}, {value:"finish"}] as const;

function CheckoutExample() {
  return <div style={neutral} className="min-w-0 border border-border bg-background p-4 text-foreground sm:p-6">
    <Stepper steps={checkoutSteps} defaultValue="bag" className="gap-5">
      <StepperList aria-label="Checkout steps" className="[&>li]:min-w-0">
        <StepperItem value="bag">Bag</StepperItem>
        <StepperItem value="shipping">Shipping</StepperItem>
        <StepperItem value="review">Review</StepperItem>
      </StepperList>
      <div className="min-h-[116px]">
        <StepperContent value="bag" keepMounted className="border-0 bg-transparent p-0 shadow-none">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><div><p className="font-medium">Everyday tote</p><p className="text-muted-foreground">One item</p></div><p className="font-medium">$24.00</p></div>
          <div className="flex justify-between pt-3 font-medium"><span>Subtotal</span><span>$24.00</span></div>
        </StepperContent>
        <StepperContent value="shipping" keepMounted className="border-0 bg-transparent p-0 shadow-none">
          <label className="grid gap-2 text-sm font-medium">Delivery address<input className={field} placeholder="Street address" autoComplete="off"/></label>
        </StepperContent>
        <StepperContent value="review" keepMounted className="border-0 bg-transparent p-0 shadow-none">
          <p className="font-medium">Review your order</p><p className="mt-2 text-muted-foreground">This is an example. No payment or order will be submitted.</p>
        </StepperContent>
      </div>
      <div className="flex justify-between gap-2 border-t border-border pt-3"><StepperPrevious>Back</StepperPrevious><StepperNext>Continue</StepperNext></div>
    </Stepper>
  </div>;
}

function VerticalExample() {
  return <div style={neutral} className="min-w-0 border border-border bg-background p-4 text-foreground sm:p-6">
    <Stepper steps={setupSteps} defaultValue="profile" orientation="vertical" className="gap-5">
      <StepperList aria-label="Setup steps">
        <StepperItem value="profile" defaultTrigger={false}>
          <StepperTrigger><StepperIndicator/><StepperLabel>Profile</StepperLabel></StepperTrigger>
        </StepperItem>
        <StepperItem value="preferences" defaultTrigger={false}>
          <StepperTrigger><StepperIndicator/><StepperLabel>Preferences</StepperLabel></StepperTrigger>
        </StepperItem>
        <StepperItem value="finish" defaultTrigger={false}>
          <StepperTrigger><StepperIndicator/><StepperLabel>Finish</StepperLabel></StepperTrigger>
        </StepperItem>
      </StepperList>
      <div className="min-h-[62px]">
        <StepperContent value="profile" keepMounted className="border-0 bg-transparent p-0 shadow-none"><label className="grid gap-2 font-medium">Display name<input className={field} placeholder="Your name" autoComplete="off"/></label></StepperContent>
        <StepperContent value="preferences" keepMounted className="border-0 bg-transparent p-0 shadow-none"><label className="flex min-h-10 items-center gap-2"><input type="checkbox" className="size-4 accent-neutral-800"/>Receive product updates</label></StepperContent>
        <StepperContent value="finish" keepMounted className="border-0 bg-transparent p-0 shadow-none"><p className="font-medium">Setup complete</p><p className="text-muted-foreground">Nothing is saved.</p></StepperContent>
      </div>
      <div className="flex justify-between gap-2 border-t border-border pt-3"><StepperPrevious>Back</StepperPrevious><StepperNext>Continue</StepperNext></div>
    </Stepper>
  </div>;
}

const basicCode = `import {
  Stepper, StepperList, StepperItem,
  StepperContent, StepperPrevious, StepperNext,
} from "@/components/ui/stepper"

export function Example() {
  return (
    <Stepper defaultValue="account">
      <StepperList>
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="review">Review</StepperItem>
      </StepperList>
      <StepperContent value="account">Account details</StepperContent>
      <StepperContent value="review">Review details</StepperContent>
      <StepperPrevious>Back</StepperPrevious>
      <StepperNext>Continue</StepperNext>
    </Stepper>
  )
}`;

export default function IdentityStudy() {
  return <main className="stepper-identity min-h-dvh bg-[#eae8e5] text-[#242424] selection:bg-[#be151b] selection:text-white" style={{colorScheme:"light"}}>
    <style>{identityStyles}</style>
    <div className="identity-frame mx-4 max-w-[1320px] sm:mx-8 xl:mx-auto">
      <header className="identity-rule flex flex-wrap items-center justify-between gap-3 px-3 py-3 text-[#be151b] sm:px-6">
        <Link href="/drafts/identity" className="inline-flex h-11 items-center gap-2.5">
          <StepperLogo className="h-9 w-7"/>
          <span className="text-xl font-semibold tracking-tight">Stepper</span>
        </Link>
        <nav aria-label="Stepper" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium sm:gap-x-6">
          <Link href="#install" className="inline-flex min-h-11 items-center hover:underline">Install</Link>
          <Link href="/docs" className="inline-flex min-h-11 items-center hover:underline">Docs</Link>
          <a href="https://github.com/francozeta/stepper" className="inline-flex min-h-11 items-center gap-1 hover:underline">GitHub <ArrowUpRight aria-hidden="true" className="size-4"/></a>
        </nav>
      </header>
      <section className="identity-rule grid min-w-0 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative min-w-0 px-3 pt-9 pb-8 sm:px-6 lg:py-14 lg:pr-8">
          <h1 className={`${serif} text-[clamp(3rem,6.5vw,6.8rem)] leading-[.9] text-[#be151b]`}>Make progress<br/>feel <em className="font-normal">natural.</em></h1>
          <p className="mt-6 max-w-[43ch] text-base leading-relaxed sm:text-lg">A composable React primitive for multi-step flows. Build onboarding, checkouts and forms with accessible navigation and progress.</p>
          <div className="mt-6 flex flex-wrap gap-0">
            <Link href="#install" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#be151b] bg-[#be151b] px-4 text-sm font-medium text-white hover:bg-[#a20e14]">Get started <ArrowRight aria-hidden="true" className="size-4"/></Link>
            <Link href="/docs" className="inline-flex min-h-11 items-center justify-center gap-2 border-y border-r border-[#be151b] px-4 text-sm font-medium text-[#be151b] hover:bg-[#be151b]/5">Documentation</Link>
          </div>
          <div className="mt-7 border-t border-[#be151b]/40 pt-3">
            <CodeBlockCommand {...registryInstallCommands} className="w-full"/>
          </div>
        </div>
        <div className="min-w-0 border-t border-[#be151b]/45 lg:border-t-0 lg:border-l">
          <div className="flex items-center justify-between border-b border-[#be151b]/45 px-3 py-2.5 text-sm text-[#be151b] sm:px-6">
            <span className="font-medium">Live example</span><span className="font-mono">01</span>
          </div>
          <div className="grid min-h-[310px] items-center px-3 py-6 sm:px-6 lg:min-h-[calc(100%_-_42px)]"><Demo/></div>
        </div>
      </section>

      <section id="anatomy" className="identity-rule scroll-mt-4">
        <div className="grid min-w-0 lg:grid-cols-[.7fr_1.3fr]">
          <div className="min-w-0 px-3 py-7 sm:px-6 lg:py-9">
            <h2 className={`${serif} text-5xl text-[#be151b] sm:text-6xl`}>Anatomy.</h2>
            <p className="mt-4 max-w-[36ch] leading-relaxed">The parts you see are the parts you compose. Select Anatomy to inspect the real component, or Code to see its JSX.</p>
            <dl className="mt-6 grid gap-0 border-t border-[#be151b]/45 text-sm">
              {[
                ["Trigger","Selects a step."],
                ["Indicator","Shows its state."],
                ["Label","Names the stage."],
                ["Separator","Track and fill show progress."],
                ["Content","Renders the active panel."],
                ["Navigation","Moves backward or forward."],
              ].map(([name,desc])=><div key={name} className="grid grid-cols-[minmax(88px,.7fr)_1fr] gap-2 border-b border-[#be151b]/25 py-2.5"><dt className="font-medium text-[#be151b]">{name}</dt><dd>{desc}</dd></div>)}
            </dl>
            <Link href="/docs/api" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#be151b] hover:underline">API reference <ArrowUpRight aria-hidden="true" className="size-4"/></Link>
          </div>
          <div className="min-w-0 border-t border-[#be151b]/45 px-3 py-5 sm:px-6 lg:border-t-0 lg:border-l lg:py-9"><Anatomy/></div>
        </div>
      </section>

      <section id="examples" className="identity-rule scroll-mt-4">
        <div className="px-3 py-7 sm:px-6 lg:py-9">
          <h2 className={`${serif} text-5xl text-[#be151b] sm:text-6xl`}>One primitive.<br className="sm:hidden"/> Many forms.</h2>
          <p className="mt-3 max-w-[55ch] leading-relaxed">The same Stepper adapts to the layout and language of your product.</p>
        </div>
        <div className="grid min-w-0 border-t border-[#be151b]/45 md:grid-cols-2">
          <div className="min-w-0 px-3 py-5 sm:px-6">
            <h3 className="mb-3 flex items-center justify-between font-medium text-[#be151b]">Checkout <span className="font-mono text-sm">Horizontal</span></h3>
            <CheckoutExample/>
          </div>
          <div className="min-w-0 border-t border-[#be151b]/45 px-3 py-5 sm:px-6 md:border-t-0 md:border-l">
            <h3 className="mb-3 flex items-center justify-between font-medium text-[#be151b]">Account setup <span className="font-mono text-sm">Vertical</span></h3>
            <VerticalExample/>
          </div>
        </div>
      </section>

      <section id="install" className="identity-rule scroll-mt-4 grid min-w-0 lg:grid-cols-[.8fr_1.2fr]">
        <div className="min-w-0 px-3 py-7 sm:px-6 lg:py-9">
          <h2 className={`${serif} text-5xl text-[#be151b] sm:text-6xl`}>Make it yours.</h2>
          <p className="mt-4 max-w-[40ch] leading-relaxed">Install Stepper with the shadcn CLI. The component source belongs to your project. No brand styles are imposed.</p>
          <p className="mt-5 border-t border-[#be151b]/45 pt-3 text-sm">Requires an initialized shadcn project and Node.js 22 or newer.</p>
          <CodeBlockCommand {...registryInstallCommands} className="mt-4 w-full"/>
          <p className="mt-4 text-sm">Then import from <code className="break-all font-mono text-[#be151b]">@/components/ui/stepper</code>.</p>
          <Link href="/docs/installation" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#be151b] hover:underline">Installation guide <ArrowUpRight aria-hidden="true" className="size-4"/></Link>
        </div>
        <div className="min-w-0 border-t border-[#be151b]/45 lg:border-t-0 lg:border-l">
          <div style={neutral} className="flex min-h-11 items-center justify-between gap-2 border-b border-[#be151b]/45 px-3 text-[#be151b] sm:px-6">
            <span className="flex items-center gap-2 text-sm font-medium"><Code2 aria-hidden="true" className="size-4"/> First component</span>
            <CopyButton value={basicCode} label="Copy example" iconOnly className="size-9 shrink-0"/>
          </div>
          <pre tabIndex={0} className="max-h-[390px] overflow-auto px-3 py-5 font-mono text-xs leading-6 text-[#242424] focus-visible:outline-2 focus-visible:outline-[#be151b] sm:px-6 sm:text-sm"><code>{basicCode}</code></pre>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 px-3 py-5 sm:px-6">
        <p className={`${serif} text-2xl italic text-[#be151b] sm:text-3xl`}>Expressive by identity. Neutral by design.</p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#be151b]"><Link href="/drafts/interactions" className="hover:underline">Research</Link><a href="https://github.com/francozeta" className="hover:underline">By francozeta</a></div>
      </footer>
    </div>
  </main>;
}
