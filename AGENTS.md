<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Shared standard

With the authorized local MDS bridge installed, run `node scripts/mds.mjs context` and read the pinned contract before implementation. Set `MDS_HOME` if the source checkout is elsewhere. Restore the local bridge or pin if it becomes unavailable. Public contributors use the checked-in Stepper contracts below.

## UI SDK experiments

Before using UI SDK, follow its installed skill if available and read node_modules/@ui-sdk/react/docs/llms.txt. For custom primitives, consult the relevant headings in core.md and rendering.md. The SDK is experimental and must not become a registry dependency without separate validation.

## Design and MDS consultation

Read CURRENT.md, DESIGN.md and the relevant portion of docs/stepper-next.md before meaningful UI changes. Treat owner-approved previews as the baseline; use intent → exploration → implementation → critique → refinement, not an unsolicited redesign. Read the actual source, preserve the established anatomy and behavior, and distinguish visual validation from green CI. Keep the change on the current review branch; no merge or release without explicit owner approval.

MDS is the maintainer's separate design/engineering source. For a local authorized checkout, consult its project contract and design-judgment guide at a reviewed main revision. To adopt the official bridge, run the parent initializer with --dry-run first and --no-skills for this public repository, merge existing AGENTS.md deliberately, and review generated files before committing. Never publish the private parent contents, credentials, private skill catalog or private URLs. If the parent is unavailable, report that limitation and use the checked-in Stepper design contract; do not claim full MDS adoption. Keep repository docs in English.

Run pnpm check; validate the generated registry and compare the previous preview against the current preview with identical inputs. For meaningful interaction changes, inspect desktop/mobile keyboard and focus, reduced motion, rapid forward/back, and async validation. The final handoff must name the commit, tested scenarios, failures and remaining uncertainty. No generic redesign, new dependency or core/agent abstraction without evidence.
