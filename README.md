# Ikiform

<br />
<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>
<br />
<br />
<br />

Ikiform is a modern, AI-powered form builder and analytics platform. It allows users to create, manage, and analyze forms with advanced features such as AI-assisted form creation, analytics, and integrations.

Built with Next.js App Router, React, Supabase, and Tailwind CSS.

- AI-powered form builder
- Real-time analytics and reporting
- User authentication and dashboard
- Customizable appearance and themes

## Tech Stack

- Next.js 16 (App Router + Turbopack)
- React 19
- Supabase
- Tailwind CSS v4
- Base UI primitives via `@base-ui/react`
- shadcn CLI with `base-vega` style (`components.json`)
- Playwright for browser E2E/regression coverage

## Quick Start

1. Install dependencies:
   - `bun install`
2. Configure environment:
   - `cp .env.example .env.local`
   - Fill required values in `.env.local`
3. Start local dev server:
   - `bun run dev`

The app will be available at `http://localhost:3000` by default.

## Scripts

- `bun run dev`: Start development server.
- `bun run build`: Production build.
- `bun run start`: Start production server.
- `bun run lint`: Lint checks.
- `bun run format`: Auto-format code.
- `bun run check`: Full static checks (via ultracite).
- `bun run test:e2e`: Run Playwright E2E suite.
- `bun run test:e2e:headed`: Run E2E tests in headed mode.
- `bun run test:e2e:ui`: Open Playwright UI mode.
- `bun run test:e2e:report`: Open Playwright HTML report.
- `bun run agent:live-login`: Run live agent-browser login automation helper.

## Routes Overview

### Public App Routes

- `/`: Marketing home.
- `/login`: Auth UI.
- `/reset-password`: Password reset.
- `/changelog`: Product changelog.
- `/embed`, `/embed/test`: Embed tooling and preview.
- `/ai-builder`: AI builder UI.
- `/demo-form-builder`: Demo experience.
- `/form-builder`: Form builder index.
- `/form-builder/[id]`: Builder editor.
- `/form-builder/[id]/customize`: Form customization.
- `/forms/[id]`: Internal form page.
- `/f/[slug]`: Public form by slug.
- `/success`: Post-checkout/success state.
- `/legal/privacy`, `/legal/terms`, `/legal/gdpr`, `/legal/dpa`: Legal pages.

### Authenticated/Admin Routes

- `/dashboard`: User dashboard.
- `/dashboard/forms/[id]/analytics`: Form analytics.
- `/dashboard/forms/[id]/submissions`: Form submissions.
- `/admin`: Admin dashboard.
- `/admin/forms/[formId]`: Admin form details.
- `/admin/users/[userId]`: Admin user details.

### Internal Test Harness Route

- `/e2e-ui`: Internal UI regression harness for Playwright checks.
- This route is blocked from indexing and excluded from sitemap output.

## API Route Groups

- Auth/identity: `/auth/callback`, `/api/user`, `/api/chat/sessions`
- AI: `/api/ai-builder`, `/api/ai-builder/chat`, `/api/analytics-chat`, `/api/analytics-chat/history`
- Forms: `/api/forms/[id]/submit`, `/api/forms/[id]/api-submit`, `/api/demo-options`
- Upload/files: `/api/upload`, `/api/files/refresh-urls`
- Webhooks: `/api/webhook`, `/api/webhook/[id]`, `/api/webhook/[id]/test`, `/api/webhook/[id]/resend`, `/api/webhook/inbound`, `/api/webhook/inbound/[id]`, `/api/webhook/logs`, `/api/webhook/polar`
- Admin: `/api/admin/form-submissions`, `/api/admin/user-forms`, `/api/users/count`, `/api/users/emails`, `/api/users/stats`
- Maintenance: `/api/cron/expire-trials`, `/api/google-fonts`, `/checkout`, `/portal`

## UI System Notes

- `components.json` is configured with:
  - `style: "base-vega"`
  - Base UI-backed shadcn generation
- UI primitives and wrappers are in `src/components/ui/`.

## Testing and Browser Automation

### Playwright E2E

- Config: `playwright.config.ts`
- Specs:
  - `e2e/smoke-interactions.spec.ts`
  - `e2e/ui-regressions.spec.ts`

For authenticated E2E checks:

```bash
E2E_TEST_EMAIL="your-email@example.com" \
E2E_TEST_PASSWORD="your-password" \
bun run test:e2e
```

### Agent Browser Live Session

Use the helper script to run a real browser login flow you can watch:

```bash
AB_EMAIL="your-email@example.com" \
AB_PASSWORD="your-password" \
bun run agent:live-login
```

Optional base URL argument:

```bash
AB_EMAIL="your-email@example.com" \
AB_PASSWORD="your-password" \
bun run agent:live-login -- http://127.0.0.1:3000
```

## Project Structure

```plaintext
Ikiform/
├── e2e/                          # Playwright E2E and regression specs
├── public/                       # Static assets + generated robots/sitemap
├── scripts/
│   └── agent-browser/            # Browser automation helpers
├── src/
│   ├── app/                      # Next.js app routes and API handlers
│   ├── components/               # Reusable React components
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Services, API clients, utilities
│   └── utils/                    # Shared runtime utils
├── components.json               # shadcn config (base-vega style)
├── next.config.ts                # Next.js configuration
├── next-sitemap.config.js        # Sitemap/robots configuration
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Scripts + dependencies
└── README.md                     # Project documentation
```

## Roadmap

[https://www.ikiform.com/roadmap](https://www.ikiform.com/roadmap)
