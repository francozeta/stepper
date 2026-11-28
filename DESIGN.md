# Stepper — Design contract

**Make progress feel natural.** Stepper is a composable progress and navigation primitive. The application owns the workflow. Preserve the current visual direction and the owner's approved interaction details rather than applying a generic redesign.

## Anatomy and intent

- Indicator: number/status symbol. Label and Description: the step's text.
- Trigger: actual interactive hit area. Focus outline: keyboard focus, not current selection.
- Connector: public StepperSeparator. Track is its background; Fill is its progress.
- Panel: StepperContent. Navigation: persistent Back/Continue controls.

## Durable decisions from the lab

- Motion continuity and spatial stability are different. A smooth shift can still make a repeated target difficult to find. Compare the Instant, Adaptive, Spatial and Continuity modes in /drafts/interactions. Spatial's intrinsic grid keeps controls in place across unchanged stages; extra whitespace, mobile keyboard and unbounded panel sizes are trade-offs. Do not impose a fixed pixel height globally.
- One shared progress cursor drives Connector Fill; forward fills in sequence, backward retracts last-to-first. Keep reversal from the in-flight value, reduced motion and instant semantic state changes. Do not restore independent staggered timers. Owner rejected overlapping retraction and slow motion; current 110 ms per segment, 330 ms cap are Stepper tuning, not universal tokens.
- Preserve the inset keyboard-visible outline, arrow-key focus without selection, native disabled semantics, and recovery when an action becomes disabled. Never hide focus as a cosmetic fix.
- Panel motion is deliberately subtle and directional (8 px, 160 ms in the lab). Cancel obsolete motion, preserve inputs and keep inactive content inert/hidden from assistive technology. Full visual reversal and mobile/AT behavior are still to be validated.
- Keep typography, spacing, existing monochrome treatment and compact controls. Do not add decorative containers, accordions or extra copy unless they solve a concrete problem. The labs are research surfaces, not new product navigation or a style template for every consumer.
- Use at least 16 CSS px for form fields on touch devices to prevent Safari's focus zoom. Allow manual browser zoom. Use the [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) as a review reference for touch, focus and forms.
- A newer valid navigation request supersedes older pending guarded requests across controls. Pending validation exposes semantic busy state, but the application owns cancellation of external side effects and authorization. Do not revive stale navigation after a denied request.
- Agent-ready means semantic actions with a human interface, not a technical simulator as the product. Keep validation app-owned; no silent overwriting, final confirmation remains human. UI SDK is an opt-in experiment in /drafts/onboarding, not a mandatory dependency of the registry primitive.

## Review protocol

Establish a baseline with the current preview and the same task, content, viewport and input mode. Change one justified variable. Compare before/after at narrow mobile (including keyboard), desktop, keyboard-only, rapid forward/back, interrupted async guard, reduced motion, long labels and custom composition. Check actual screenshots and interactions, not only build output. Record user feedback, rejected alternatives, trade-offs and unverified limits in the existing PR. Do not declare visual acceptance for the owner.

A new animation or abstraction must address a specific observed friction. Prefer no change if the evidence is weak. Keep the current approved appearance during cn migration. Use the vocabulary above when reporting defects so humans and coding agents refer to the same surface.
