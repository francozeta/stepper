// Compile each adapter as a separate module so unrelated packages never enter its bundle.
const stepper = `
import { Stepper, StepperItem, StepperList, StepperContent, StepperNext, StepperPrevious, StepperTrigger, StepperIndicator, StepperLabel, StepperSeparator } from "./core";
const steps = ids.map(value => ({ value }));
export function Adapter({ step, panels, request, busy }) {
  return <Stepper steps={steps} value={ids[step]} onValueChange={value => request(ids.indexOf(value))}>
    <StepperList data-bench-list>{ids.map((value, i) => (
      <StepperItem key={value} value={value} completed={i < step} defaultTrigger={false} separator={false}>
        <StepperTrigger data-bench-step={i} render={<button data-bench-host="" />}>
          <StepperIndicator>{i + 1}</StepperIndicator><StepperLabel>{names[i]}</StepperLabel>
        </StepperTrigger>
        {i < ids.length - 1 && <StepperSeparator data-bench-separator />}
      </StepperItem>
    ))}</StepperList>
    {ids.map((value, i) => <StepperContent key={value} value={value}>{panels[i]}</StepperContent>)}
    <footer><StepperPrevious data-bench-control="back">Back</StepperPrevious><StepperNext data-bench-control="next" disabled={busy || step === 2}>Continue</StepperNext></footer>
  </Stepper>;
}`;

export const adapters = {
  native: `
export function Adapter({ step, panels, request, busy }) {
  return <div>
    <ol aria-label="Progress steps" data-bench-list onKeyDown={moveFocus}>{names.map((name, i) => (
      <li key={name}>
        <button type="button" data-bench-host="" data-bench-step={i} aria-current={i === step ? "step" : undefined}
          aria-controls={i === step ? "native-panel" : undefined} id={"native-trigger-" + i} onClick={() => request(i)}>
          <span aria-hidden="true">{i + 1}</span>{name}
        </button>
        {i < 2 && <span data-bench-separator aria-hidden="true" />}
      </li>
    ))}</ol>
    <section id="native-panel" aria-labelledby={"native-trigger-" + step}>{panels[step]}</section>
    <footer><button type="button" data-bench-control="back" disabled={step === 0} onClick={() => request(step - 1)}>Back</button><button type="button" data-bench-control="next" disabled={busy || step === 2} onClick={() => request(step + 1)}>Continue</button></footer>
  </div>;
}`,
  "stepper-before": stepper,
  stepper,
  ark: `
import { Steps } from "@ark-ui/react/steps";
export function Adapter({ step, panels, request, busy }) {
  return <Steps.Root count={3} step={step} onStepChange={event => request(event.step)}>
    <Steps.List aria-label="Progress steps" data-bench-list onKeyDown={moveFocus}>{names.map((name, i) => (
      <Steps.Item key={name} index={i}>
        <Steps.Trigger data-bench-step={i} asChild><button data-bench-host=""><Steps.Indicator aria-hidden="true">{i + 1}</Steps.Indicator>{name}</button></Steps.Trigger>
        {i < 2 && <Steps.Separator data-bench-separator />}
      </Steps.Item>
    ))}</Steps.List>
    {panels.map((panel, i) => <Steps.Content key={i} index={i}>{panel}</Steps.Content>)}
    <footer><Steps.PrevTrigger data-bench-control="back">Back</Steps.PrevTrigger><Steps.NextTrigger data-bench-control="next" disabled={busy || step === 2}>Continue</Steps.NextTrigger></footer>
  </Steps.Root>;
}`,
  stepperize: `
import { defineStepper } from "@stepperize/react";
const { Stepper } = defineStepper(ids.map(id => ({ id })));
export function Adapter({ step, panels, request, busy }) {
  return <Stepper.Root step={ids[step]} onStepChange={id => request(ids.indexOf(id))}>
    <Stepper.List aria-label="Progress steps" data-bench-list>{ids.map((id, i) => (
      <Stepper.Item step={id} key={id} role="presentation">
        <Stepper.Trigger data-bench-step={i} data-bench-host=""><Stepper.Indicator aria-hidden="true">{i + 1}</Stepper.Indicator>{names[i]}</Stepper.Trigger>
        {i < 2 && <Stepper.Separator data-bench-separator />}
      </Stepper.Item>
    ))}</Stepper.List>
    {ids.map((id, i) => <Stepper.Content step={id} key={id}>{panels[i]}</Stepper.Content>)}
    <Stepper.Actions data-bench-footer=""><Stepper.Prev data-bench-control="back" disabled={step === 0}>Back</Stepper.Prev><Stepper.Next data-bench-control="next" disabled={busy || step === 2}>Continue</Stepper.Next></Stepper.Actions>
  </Stepper.Root>;
}`,
  dice: `
import { Stepper, StepperList, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperSeparator, StepperContent, StepperPrev, StepperNext } from "./dice";
export function Adapter({ step, panels, accept, validate, busy }) {
  return <Stepper value={ids[step]} onValueChange={id => accept(ids.indexOf(id))} onValidate={id => validate(ids.indexOf(id))} activationMode="manual" loop={false}>
    <StepperList aria-label="Progress steps" data-bench-list>{ids.map((value, i) => (
      <StepperItem value={value} key={value}>
        <StepperTrigger data-bench-step={i} render={<button data-bench-host="" />}>
          <StepperIndicator aria-hidden="true">{i + 1}</StepperIndicator><StepperTitle>{names[i]}</StepperTitle>
        </StepperTrigger>
        {i < 2 && <StepperSeparator data-bench-separator />}
      </StepperItem>
    ))}</StepperList>
    {ids.map((value, i) => <StepperContent value={value} key={value}>{panels[i]}</StepperContent>)}
    <footer><StepperPrev data-bench-control="back">Back</StepperPrev><StepperNext data-bench-control="next" disabled={busy || step === 2}>Continue</StepperNext></footer>
  </Stepper>;
}`,
};

// The earlier Stepper study used the primitive's own Previous/Next guard path.
export const stepperGuard = `
import { Stepper, StepperItem, StepperList, StepperContent, StepperNext, StepperPrevious } from "./core";
const steps = ids.map(value => ({ value }));
export function Adapter({ step, panels, accept, validate }) {
  return <Stepper steps={steps} value={ids[step]} onValueChange={value => accept(ids.indexOf(value))}>
    <StepperList data-bench-list>{ids.map((value, i) => (
      <StepperItem key={value} value={value}>{names[i]}</StepperItem>
    ))}</StepperList>
    {ids.map((value, i) => <StepperContent key={value} value={value}>{panels[i]}</StepperContent>)}
    <footer><StepperPrevious data-bench-control="back">Back</StepperPrevious><StepperNext data-bench-control="next" onBeforeNext={() => validate(step + 1)}>Continue</StepperNext></footer>
  </Stepper>;
}`;

export const adapterHeader = `
const names = ["Business", "Preferences", "Review"];
const ids = ["business", "preferences", "review"];
function moveFocus(event) {
  if (event.defaultPrevented || event.target.dataset.benchStep === undefined) return;
  const index = Number(event.target.dataset.benchStep);
  const key = event.key;
  const to = key === "Home" ? 0 : key === "End" ? 2
    : key === "ArrowRight" ? index + 1 : key === "ArrowLeft" ? index - 1 : -1;
  const next = event.currentTarget.querySelector('[data-bench-step="' + to + '"]');
  if (next) { event.preventDefault(); next.focus(); }
}
`;
