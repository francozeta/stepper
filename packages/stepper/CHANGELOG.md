# @francozeta/stepper Changelog

## [0.2.0](https://github.com/francozeta/stepper/compare/v0.1.6...v0.2.0) (2026-05-01)

### Features

* enhance documentation and examples with new install command and recipe patterns ([42975dd](https://github.com/francozeta/stepper/commit/42975dd4e05f7567ad4015c408d49112e11696a4))

## [0.1.6](https://github.com/francozeta/stepper/compare/v0.1.5...v0.1.6) (2026-05-01)

### Bug Fixes

* sync sidebar release version ([51f5e95](https://github.com/francozeta/stepper/commit/51f5e958108c2a418f5074e58108baaae004b34e))

## 0.1.5

- Added compiled package CSS at `@francozeta/stepper/styles.css`.
- Removed the need for Tailwind `@source`, `content`, or node_modules scanning in consumer apps.
- Added package-local fallback theme variables while still respecting shadcn/ui semantic tokens.
- Kept the generated shadcn-style registry artifact available for copy-paste ownership.

## 0.1.4

- Default completed indicators now render a completion mark instead of repeating the step number.
- Step items expose `data-position="previous|current|next"` for custom styling and variants.
- Package docs include clearer npm install guidance.

## 0.1.3

- Replaced the `radix-ui` umbrella dependency with `@radix-ui/react-slot`.
- Updated the bundled shadcn-style registry item to depend on `@radix-ui/react-slot`.
- Added explicit npm usage docs for Tailwind v4, Tailwind v3, and required shadcn semantic tokens.

## 0.1.2

- Added package-level `devDependencies` metadata so npm shows the build and test stack used by the package.

## 0.1.1

- Initial npm package build for the Stepper primitive.
- Exports compiled ESM, CommonJS, and TypeScript declarations.
- Includes the generated shadcn-style registry artifact.
- Keeps React as a peer dependency and limits runtime dependencies to `clsx`, `tailwind-merge`, and Radix Slot.
