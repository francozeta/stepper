# Contributing

Thanks for taking the time to improve Stepper.

Stepper is a shadcn-style registry component. Changes should stay small,
reviewable, and focused on the Stepper primitive, its examples, docs, tests, or
repo automation.

## Local Setup

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm check
```

That command verifies the registry output, lint, typecheck, tests, and
production build.

## Registry Changes

The public registry output is generated from the source files in
`components/ui/stepper/*` and `registry/default/*`.

When changing the Stepper component, examples, or registry metadata, run:

```bash
pnpm registry:build
```

Commit generated registry changes when they are part of the behavior being
reviewed.

## Commit Style

Use Conventional Commits when possible:

```txt
fix: correct stepper keyboard navigation
feat: add vertical stepper variant
docs: improve installation guide
chore: update repo maintenance files
test: cover disabled step behavior
ci: update GitHub Actions
```

Release Please uses those commits on `main` to prepare version bumps, changelog
updates, tags, and GitHub Releases.

## Pull Requests

Keep pull requests focused. Include a short explanation of:

- what changed
- why it changed
- how it was tested
- whether docs, tests, or registry output were updated

Use the pull request template and check the relevant boxes before requesting
review.

## Reporting Issues

Use the issue forms for bugs, feature requests, and docs improvements. For
bugs, a small reproduction is the fastest way to make the issue actionable.
