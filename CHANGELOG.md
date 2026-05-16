# Changelog

## [0.9.0-beta.1](https://github.com/francozeta/stepper/compare/v0.9.0-beta.0...v0.9.0-beta.1) (2026-05-16)


### Bug Fixes

* stabilize stepper adapter preview ([903e21b](https://github.com/francozeta/stepper/commit/903e21b4e86659f9e0160a5cf3f460c5ce38b92b))


### Documentation

* add adapters hub ([6a154d5](https://github.com/francozeta/stepper/commit/6a154d54de46316cb249ce71805565724da719e4))
* add checkout receipt barcode ([3b9ff33](https://github.com/francozeta/stepper/commit/3b9ff33b2faee4758c90cc2bac8c1f70657af0cb))
* add react hook form adapter guide ([e690bda](https://github.com/francozeta/stepper/commit/e690bda40c568d6908960e813f0ee989a9905d82))
* add react hook form adapter preview ([cbf792b](https://github.com/francozeta/stepper/commit/cbf792b13189ca114337a5e612a7f6059ff976b1))
* polish checkout receipt state ([18ecb3a](https://github.com/francozeta/stepper/commit/18ecb3a0a41bf20276d6615161320459b07365cc))
* simplify checkout receipt state ([4d2be2b](https://github.com/francozeta/stepper/commit/4d2be2baf5ea56712d4d9cf4fb4c1df030ee0144))
* tighten adapter preview footer ([c54bca2](https://github.com/francozeta/stepper/commit/c54bca23ed1af88d8aadca815b3f8bdc3e15d085))


### Refactors

* simplify stepper registration ([0f83e0a](https://github.com/francozeta/stepper/commit/0f83e0a2a2f7ff4dd069f5a85ec3a0979694bd6c))
* simplify stepper registration ([cdf3967](https://github.com/francozeta/stepper/commit/cdf3967c50aa5f31f96ffd1ce44e861f46f72412))

## [0.8.0](https://github.com/francozeta/stepper/compare/v0.7.2...v0.8.0) (2026-05-04)


### Features

* **web:** add SVG icons and update layout metadata ([7869e44](https://github.com/francozeta/stepper/commit/7869e4484d062e57158bd2ecc6986a7400123319))

## [0.7.2](https://github.com/francozeta/stepper/compare/v0.7.1...v0.7.2) (2026-05-02)


### Bug Fixes

* keep release feed aligned with registry version ([0064bc6](https://github.com/francozeta/stepper/commit/0064bc63bedaf35ff0eab5090a9d9ae539fd81a9))

## [0.7.1](https://github.com/francozeta/stepper/compare/v0.7.0...v0.7.1) (2026-05-02)


### Documentation

* align changelog with registry v0.7.0 ([449b273](https://github.com/francozeta/stepper/commit/449b27392315423200c837b5df0c2c51f623cc0b))

## [0.7.0](https://github.com/francozeta/stepper/compare/v0.6.2...v0.7.0) (2026-05-02)


### Features

* add release candidate 0.6.2 with new warnings and documentation updates ([4114d37](https://github.com/francozeta/stepper/commit/4114d37ce88d6b422b65748737fe7603c0ce16a0))

## [0.6.2](https://github.com/francozeta/stepper/compare/v0.6.1...v0.6.2) (2026-05-02)


### Bug Fixes

* enhance CopyButton and Docs components with improved responsiveness and functionality ([e3dc743](https://github.com/francozeta/stepper/commit/e3dc743886149220e9ea6857e65e38a7487e833b))
* enhance stepper functionality with duplicate value checks and context management ([7ac3d6c](https://github.com/francozeta/stepper/commit/7ac3d6c03f7aa3c142e92d094a2c6ceb35e26e76))

## [0.6.1](https://github.com/francozeta/stepper/compare/v0.6.0...v0.6.1) (2026-05-02)


### Tests

* add validation for Stepper primitive markers in registry output ([d1655f2](https://github.com/francozeta/stepper/commit/d1655f2a0731669bd99372fb573c28bf2ce2b153))

## [0.6.0](https://github.com/francozeta/stepper/compare/v0.5.0...v0.6.0) (2026-05-02)


### Features

* **docs:** refactor documentation components and integrate fumadocs for improved TOC handling ([266ae02](https://github.com/francozeta/stepper/commit/266ae023d32fde193e37f4bb453e8d8af5991bdb))
* **stepper:** enhance stepper navigation with guards and keyboard support ([738796f](https://github.com/francozeta/stepper/commit/738796f292daa714dfb3c5a6625a30254ead4328))


### Bug Fixes

* implement controlled fallback synchronization logic ([8a20696](https://github.com/francozeta/stepper/commit/8a20696b733327987c697533b3790a28fe4c870f))

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
