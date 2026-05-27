# Newsly Frontend Copilot Instructions

Use these rules when reviewing or changing the frontend in this repository.

## Stack And Architecture

- This repo is a Next.js 16 App Router app with React 19, TypeScript, Tailwind CSS v4, next-intl, and Vitest/Cypress.
- Prefer server components by default. Keep `dynamic = "force-dynamic"` only where the current route already needs request-time data.
- Preserve the root composition in `src/app/layout.tsx`: `NextIntlClientProvider`, `AuthProvider`, `ThemeProvider`, and `TooltipProvider` are part of the app shell.

## Data Flow

- Do not import mock data directly into pages or components.
- Components should consume data through `src/api/services/*`.
- Services should call the internal routes defined in `src/api/routes.ts`.
- Route handlers and helpers decide whether to proxy the backend or return mock data through `src/api/mocks.ts` and `resolveDataSourceMode()`.
- Preserve the request and caching helpers in `src/api/utils/*` when touching data fetching behavior.

## Environment Rules

- Respect the environment policy documented in the README.
- `NEWSLY_ENV` and `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET` control the runtime mode.
- Keep the `*_LOCAL` and `*_DOCKER` URL variables working.
- Production must use API mode and must not depend on local mock behavior.

## UI And UX

- Keep the current visual language: Space Grotesk, Poppins, Inter, dark theme support, and the existing shell/layout spacing.
- Preserve the current section-based home page structure and existing `data-cy` hooks used by Cypress.
- Avoid introducing a new design system or replacing the current component patterns unless the task explicitly requires it.
- Maintain accessibility, responsive behavior, and visible loading or fallback states for request-driven UI.

## i18n And Metadata

- Keep next-intl translations in sync with user-facing text.
- Preserve `generateMetadata()` behavior in `src/app/layout.tsx` and any locale-aware metadata patterns.
- When adding copy, ensure it is localized instead of hardcoded in a single language unless the repo already treats it as brand text.

## Review Priorities

- Check for regressions in data source selection, route proxying, and mock fallback behavior.
- Check for broken client/server boundaries, especially around browser-only APIs, cookies, and DOM access.
- Check that new UI still works with tests, translations, and the app shell.

## Validation

- Prefer targeted Vitest and Cypress checks for the touched area.
- Use lint and build validation only when the change affects cross-cutting behavior.
