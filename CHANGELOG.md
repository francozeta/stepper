# Changelog

## [0.5.0](https://github.com/francozeta/stepper/compare/v0.4.1...v0.5.0) (2026-05-02)


### Features

* **release:** add pull request title pattern to changelog configuration ([06e1460](https://github.com/francozeta/stepper/commit/06e146040f9ea0fabd499a603e6ed9ec22e37331))
* **release:** add release automation workflow and configuration ([c745d5e](https://github.com/francozeta/stepper/commit/c745d5ed26fcbcf4c0a20b84e5b4c9d49e6f49f4))


### Refactors

* update pnpm workspace configuration and remove package build tasks ([7be2ad4](https://github.com/francozeta/stepper/commit/7be2ad4f707f842c464e118ce1d7b1e444362d83))

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
