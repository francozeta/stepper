# Changelog

## 0.4.1 - 2026-05-01

### Changed

- Repositioned Stepper as a shadcn registry component.
- Simplified the public documentation around one install flow: copy the source into `components/ui/stepper.tsx`.
- Removed the alternate runtime dependency story from the docs, README, generated Markdown, and install UI.
- Renamed the release workflow to a verify workflow that runs `pnpm check`.

### Removed

- Removed the publishable wrapper folder.
- Removed the release automation that published to external registries.
- Removed the runtime build scripts, CSS checks, and distribution-specific TypeScript/tsup configuration.

## 0.4.0 - 2026-05-01

### Changed

- Added the MDX documentation site with pages for overview, getting started, API, examples, forms, recipes, styling, and changelog.
- Added root-level shadcn registry URLs at `/registry.json`, `/stepper.json`, and `/stepper-demo.json`.
- Added Markdown, RSS, and AI handoff surfaces for docs pages.

## 0.3.2 - 2026-05-01

### Fixed

- Published the registry index and component item at root-level JSON URLs.
- Kept `/r/registry.json` and `/r/stepper.json` as compatibility rewrites for older links.

## 0.1.0 - 2026-05-01

### Added

- Added the first composable Stepper primitive with controlled and uncontrolled state.
- Added horizontal and vertical layouts, content panels, navigation helpers, and `asChild` composition.
- Added data attributes for active, completed, disabled, error, and positional styling.
