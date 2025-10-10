# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js project (TypeScript, App Router) created with `create-next-app`.
- Main app code is in `src/app/`.
- Static assets are in `public/`.
- Project uses `next/font` for font optimization (Geist by Vercel).

## Key Files & Structure
- `src/app/layout.tsx`: Root layout for all pages.
- `src/app/page.tsx`: Main landing page, entry point for editing.
- `src/app/globals.css`: Global styles.
- `public/`: Contains SVGs and static files.
- `next.config.ts`, `tsconfig.json`: Next.js and TypeScript config.

## Developer Workflows
- **Start dev server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Edit main page:** Modify `src/app/page.tsx` (auto-reloads)
- **Global styles:** Edit `src/app/globals.css`
- **Static assets:** Place in `public/` and reference via `/filename.svg`

## Patterns & Conventions
- Use functional React components with TypeScript.
- All routing is file-based under `src/app/` (App Router paradigm).
- Use CSS modules or global CSS for styling.
- Prefer importing SVGs from `public/` for static assets.
- Font loading is handled via `next/font` (see Next.js docs for usage).

## External Integrations
- No custom API or backend integration is present by default.
- For deployment, follow [Vercel's Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).

## Examples
- To add a new page: create a new folder with a `page.tsx` in `src/app/` (e.g., `src/app/about/page.tsx`).
- To update the favicon: replace `src/app/favicon.ico`.

## References
- See `README.md` for basic setup and links to Next.js documentation.
- For advanced configuration, refer to `next.config.ts` and official Next.js docs.

---
If any conventions or workflows are unclear, please ask for clarification or check the README for updates.
