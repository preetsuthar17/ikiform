# Translation Guide for AI Agents

This repository uses `next-intl` with locale-prefixed URLs and JSON message catalogs.

## Source of truth

1. Locale config:
   - `/Users/preett/Desktop/projects/ikiform/src/i18n/routing.ts`
2. Message loading:
   - `/Users/preett/Desktop/projects/ikiform/src/i18n/request.ts`
3. Message files:
   - `/Users/preett/Desktop/projects/ikiform/messages/en/*.json`
   - `/Users/preett/Desktop/projects/ikiform/messages/es/*.json`
4. Locale-aware proxy and redirects:
   - `/Users/preett/Desktop/projects/ikiform/src/proxy.ts`
5. Locale pathname helpers:
   - `/Users/preett/Desktop/projects/ikiform/src/lib/i18n/pathname.ts`
6. SEO i18n:
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/build-metadata.ts`
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/routes.ts`
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/constants.ts`
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/robots-policy.ts`
   - `/Users/preett/Desktop/projects/ikiform/src/app/sitemap.ts`
   - `/Users/preett/Desktop/projects/ikiform/src/app/robots.ts`
7. Localized long-form content:
   - `/Users/preett/Desktop/projects/ikiform/content/legal/{locale}/*.md`
   - `/Users/preett/Desktop/projects/ikiform/content/changelog/{locale}/*.md`

## Current locale policy

1. Active locales: `en`, `es`.
2. Default locale: `en`.
3. URL format: always prefixed, e.g. `/en/...`, `/es/...`.
4. Public forms remain non-localized canonical URLs:
   - `/f/[slug]`
   - `/forms/[id]`

## How to translate existing UI text

1. Add/modify keys in both locale JSON files (same key path in `en` and `es`).
2. Replace hardcoded strings in components:
   - Client component: `useTranslations("namespace.path")`
   - Server component/page: `await getTranslations("namespace.path")`
3. Keep keys hierarchical and feature-scoped (example: `product.formBuilder.formSettings.rateLimitSection.*`).
4. For links, preserve locale with helper functions:
   - `withLocaleHref(...)`
   - `withLocalePath(...)`
5. Validate with build + e2e checks (see commands below).

## Critical gotcha: partial providers

`/Users/preett/Desktop/projects/ikiform/src/app/conditional-layout.tsx` intentionally provides only a subset of messages (`nav`, `footer`, `product.trialBanner`) to header/footer/trial banner chrome.

If a chrome component calls a new namespace and you do not add it there, you will get:
`MISSING_MESSAGE: Could not resolve ...`.

When adding chrome translations:
1. Add keys to `messages/en/*.json` and `messages/es/*.json`.
2. Import the needed namespace in `conditional-layout.tsx`.
3. Extend `CHROME_MESSAGES` for all locales.

## Add a new language end-to-end (example: `fr`)

1. Update locale list:
   - `/Users/preett/Desktop/projects/ikiform/src/i18n/routing.ts`
   - Add `"fr"` to `locales`.
2. Add message files:
   - Create `/Users/preett/Desktop/projects/ikiform/messages/fr/`
   - Add `auth.json`, `dashboard.json`, `footer.json`, `home.json`, `legal.json`, `nav.json`, `product.json`, `seo.json`.
3. Register loaders:
   - `/Users/preett/Desktop/projects/ikiform/src/i18n/request.ts`
   - Add `fr` loader map and include it in `Promise.all`.
4. Update chrome message map:
   - `/Users/preett/Desktop/projects/ikiform/src/app/conditional-layout.tsx`
   - Add `fr` in `CHROME_MESSAGES`.
5. Update language switch UI:
   - `/Users/preett/Desktop/projects/ikiform/src/components/home/footer.tsx`
   - Add new `SelectItem` and translated labels in nav messages.
6. Update SEO locale mappings:
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/constants.ts`
   - Add OpenGraph locale + alternate locale relations.
7. Update metadata alternates:
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/build-metadata.ts`
   - Extend `alternates.languages` for the new locale.
8. Update localized sitemap entries:
   - `/Users/preett/Desktop/projects/ikiform/src/app/sitemap.ts`
9. Update structured data localization:
   - `/Users/preett/Desktop/projects/ikiform/src/lib/seo/structured-data.ts`
   - Replace `en/es` hardcoded helpers with a map that supports all locales.
10. Add localized legal/changelog content:
   - `/Users/preett/Desktop/projects/ikiform/content/legal/fr/*.md`
   - `/Users/preett/Desktop/projects/ikiform/content/changelog/fr/*.md`
11. Ensure localized routes exist for translated public pages:
   - `/Users/preett/Desktop/projects/ikiform/src/app/[locale]/**`
12. Add/expand tests for the new locale:
   - `/Users/preett/Desktop/projects/ikiform/e2e/translations.spec.ts`
   - `/Users/preett/Desktop/projects/ikiform/e2e/i18n-seo.spec.ts`

## Programmatic SEO rules to keep

1. Only index localized public routes listed in SEO route config.
2. Keep auth/app/admin/embed/login/reset/success noindex where policy requires.
3. Canonical and `hreflang` must be reciprocal for every indexable localized page.
4. Keep form routes canonical to non-localized `/f/...` URL strategy for this phase.

## Static rendering guidance for translated marketing pages

1. Keep translated marketing/legal/changelog pages under `/src/app/[locale]/...`.
2. Reuse shared page components and only localize metadata/content per locale wrapper.
3. Keep locale segment static generation enabled:
   - `/Users/preett/Desktop/projects/ikiform/src/app/[locale]/layout.tsx` uses:
     - `dynamic = "force-static"`
     - `generateStaticParams()`

## Hardcoded-English audit workflow

1. Find components still using hardcoded literals:

```bash
cd /Users/preett/Desktop/projects/ikiform
rg -n '"[^"]*[A-Za-z][^"]*"' src --glob '*.tsx' --glob '*.ts'
```

2. Find likely missed translation hook usage:

```bash
cd /Users/preett/Desktop/projects/ikiform
rg -n "useTranslations\\(|getTranslations\\(" src --glob '*.tsx' --glob '*.ts'
```

3. Move user-facing text into JSON keys, then re-run checks.

## Validation commands

```bash
cd /Users/preett/Desktop/projects/ikiform
bun run build
bun run test:e2e e2e/translations.spec.ts
bun run test:e2e e2e/i18n-seo.spec.ts
```

## Definition of done

1. No user-facing hardcoded English remains in translated surfaces.
2. `en` and `es` have matching key structures for used namespaces.
3. No `MISSING_MESSAGE` runtime errors.
4. Localized routes preserve locale when navigating.
5. SEO tags (`canonical`, `hreflang`, robots) match route policy.
6. Build and translation/SEO e2e tests pass.
