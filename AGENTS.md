# Repository Guidelines

## Project Structure & Module Organization
Routes and server actions live in `src/app` (locale-aware pages in `[locale]`). Reusable UI sits in `src/components`—libraries like `ui/`, `magicui/`, `tailark/`, plus domain folders. Shared logic and AI workflows belong in `src/lib` and `src/ai`, while Drizzle schemas and migrations stay in `src/db`. Place transactional emails in `src/mail`, analytics providers in `src/analytics`, static assets in `public/`, operational scripts in `scripts/`, and marketing/docs content in `content/`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` and run `pnpm dev` for the local Next.js server. Use `pnpm build` to produce the optimized bundle and `pnpm start` to serve it. `pnpm lint` triggers Biome checks, while `pnpm format` applies consistent formatting. Database work flows through Drizzle: `pnpm db:generate` emits SQL from the schema, `pnpm db:migrate` applies local changes, and `pnpm db:push` syncs to remote instances. Support tooling includes `pnpm email` for the email previewer and utility scripts such as `pnpm list-users` or `pnpm fix-payments`.

## Coding Style & Naming Conventions
Biome (`biome.json`) enforces two-space indentation, single quotes, ES5 trailing commas, and required semicolons. Module filenames favour kebab-case (`dashboard-sidebar.tsx`), hooks use the `use-` prefix (`use-session.ts`), and utilities default to named exports. Tailwind utilities live in `src/styles`; extend tokens there instead of scattering magic values. Keep server-only code in files marked with `"use server"` and avoid pulling client hooks into those modules.

## Testing Guidelines
Automated tests are not wired into package scripts, so validate changes with `pnpm dev`, linting, and focused manual QA around auth, billing, and AI flows. When adding a runner, colocate specs with the feature using `.test.ts(x)` or `.spec.ts(x)` suffixes and document the command in your PR. Update `src/db/migrations` with fixtures whenever data changes are needed for reviewers.

## Commit & Pull Request Guidelines
Follow the Conventional Commit style (`feat:`, `fix:`, `chore:`) observed in the log. Keep commits scoped, reference issue IDs in the body, and refresh `env.example` whenever environment variables change. PRs should include a concise summary, testing notes (commands + results), screenshots for UI updates, and callouts for docs or config changes. Request review once checks pass and highlight breaking changes early.

## Configuration & Secrets
Copy `env.example` to `.env` before running commands. Store production credentials with your deployment provider (Vercel, Cloudflare) and never commit secrets. Use scoped API keys for `opennextjs-cloudflare` or `wrangler`, rotate keys tied to providers in `src/ai`, and remove temporary debugging logs before merging.
