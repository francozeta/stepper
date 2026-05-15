import Link from "next/link";
import { ArrowRight, Blocks, Braces, Route } from "lucide-react";

import { CodeBlockCommand } from "@/components/code-block-command";
import { StepperLogo } from "@/components/stepper-logo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const commands = {
  pnpm: "pnpm dlx shadcn@latest add @stepper/stepper",
};

const details = [
  {
    label: "Typed",
    value: "value-safe primitives",
    icon: Braces,
  },
  {
    label: "Headless",
    value: "bring your own UI",
    icon: Blocks,
  },
  {
    label: "Guided",
    value: "guards, state, ARIA",
    icon: Route,
  },
];

function SidePattern({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className="stepper-home-side-pattern"
    >
      <span
        className={
          side === "left"
            ? "block h-full border-r border-white/[0.055]"
            : "block h-full border-l border-white/[0.055]"
        }
      />
    </div>
  );
}

function StepperHome() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[#050505] text-zinc-100 antialiased">
      <section className="mx-auto grid h-full w-full max-w-4xl grid-rows-[2.5rem_1fr] gap-4 overflow-hidden px-4 py-4 sm:px-6 lg:px-0">
        <header className="flex h-10 w-full items-center justify-between">
          <Link
            href="/"
            aria-label="Stepper home"
            className="grid size-10 place-items-center text-zinc-100 transition-opacity hover:opacity-75"
          >
            <StepperLogo className="h-6 w-auto" />
          </Link>

          <Link
            href="/docs"
            className="inline-flex h-10 items-center gap-2 border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white sm:px-4 sm:text-sm"
          >
            <span>View docs</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </header>

        <div className="grid min-h-0 place-items-center">
          <div
            className="stepper-home-frame grid h-full min-h-0 w-full border border-white/10"
            style={{ maxHeight: "min(32rem, calc(100dvh - 5rem))" }}
          >
            <SidePattern side="left" />

            <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#070707]">
              <BackgroundGradientAnimation
                gradientBackgroundStart="rgb(5, 5, 5)"
                gradientBackgroundEnd="rgb(9, 9, 9)"
                firstColor="rgba(255,255,255,0.025)"
                secondColor="255,255,255"
                thirdColor="180,180,180"
                fourthColor="120,120,120"
                fifthColor="210,210,210"
                pointerColor="255,255,255"
                size="34%"
                blendingValue="soft-light"
                interactive={false}
                containerClassName="absolute inset-0 h-full w-full opacity-[0.09]"
                className="absolute inset-0"
              />

              <div className="relative z-10 grid h-full min-h-0 place-items-center px-4 py-6 text-center sm:px-8">
                <div className="flex w-full max-w-xl min-w-0 flex-col items-center">
                  <div className="grid size-14 place-items-center border border-white/10 bg-white/[0.035] text-zinc-100">
                    <StepperLogo className="h-9 w-auto" />
                  </div>

                  <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-zinc-600">
                    shadcn primitive
                  </p>

                  <h1 className="stepper-home-title mt-2 max-w-full text-balance font-normal text-zinc-50">
                    Stepper
                  </h1>

                  <span className="mt-3 border border-amber-400/40 bg-amber-300 px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-zinc-950">
                    Beta
                  </span>

                  <p className="mt-3 max-w-lg text-pretty text-sm leading-6 text-zinc-400">
                    A compact primitive for typed, accessible multi-step flows.
                    Bring your own UI, keep the state machine predictable.
                  </p>

                  <CodeBlockCommand
                    className="mt-6 w-full max-w-lg min-w-0"
                    {...commands}
                  />

                  <div className="mt-4 grid w-full max-w-lg min-w-0 grid-cols-3 border border-white/10">
                    {details.map((detail, index) => {
                      const Icon = detail.icon;

                      return (
                        <div
                          key={detail.label}
                          className={`min-w-0 bg-white/[0.018] px-3 py-3 text-left ${
                            index === 0 ? "" : "border-l border-white/10"
                          }`}
                        >
                          <Icon
                            className="mb-2 size-4 text-zinc-400"
                            aria-hidden="true"
                          />
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {detail.label}
                          </p>
                          <p className="hidden truncate text-xs text-zinc-600 sm:block">
                            {detail.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <SidePattern side="right" />
          </div>
        </div>
      </section>
    </main>
  );
}

export { StepperHome };
