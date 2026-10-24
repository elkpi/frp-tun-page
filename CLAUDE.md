# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`frp-tun-page` is the public static documentation and release site for `frp-tun` (hosted at `https://frp-tun.elkpi.com` via GitHub Pages). Built with Astro 5 and Starlight, it serves dual-locale (Chinese root, English `/en/`) static HTML documentation, D2-compiled SVG network topologies, offline Pagefind search indices, and official release metadata.

The closed-source core daemon, production configs, and internal build pipelines live in a separate private repository.

---

## Commonly Used Commands

### Development & Build
- `npm install`: Install project dependencies.
- `npm run dev`: Launch local development server (`http://localhost:4321`).
- `npm run check`: Run Astro project diagnostics and TypeScript type checking.
- `npm run diagrams`: Compile D2 diagram sources (`src/assets/diagrams/*.d2`) to SVGs (`public/images/diagrams/`).
- `npm run prebuild`: Run diagrams builder, public content validator, and release metadata validator.
- `npm run build`: Full production build (outputs to `dist/`, builds Pagefind search index).

### Testing & Validation
- `npm test`: Run the full test suite using Node.js native test runner (`node --test`).
- `node --test tests/<file>.test.mjs`: Run a single test file (e.g. `node --test tests/documentation-contract.test.mjs`).
- `node --test --test-name-pattern="<pattern>" tests/<file>.test.mjs`: Run tests matching a specific pattern.
- `npm run validate:content`: Run strict regex scanning for IP/credential leaks (`scripts/validate-public-content.mjs`).
- `npm run validate:releases`: Validate release notes frontmatter, sections, and slug alignment (`scripts/validate-release-metadata.mjs`).

---

## Architecture & Code Structure

### Dual-Locale Starlight Configuration
- **Root Locale**: Simplified Chinese (`/`, `src/content/docs/*.mdx`).
- **English Locale**: English (`/en/`, `src/content/docs/en/*.mdx`).
- **Sidebar Localization**: Configured in `astro.config.mjs`. Every group and item must provide `translations: { en: '...' }`; otherwise, Starlight falls back to the default Chinese label.
- **Content Parity**: Every document in `src/content/docs/` must have a corresponding English counterpart in `src/content/docs/en/` (enforced by `tests/documentation-contract.test.mjs`).

### Slug & Routing Pitfall (Dots in Versions)
- Astro's default `github-slugger` strips dots (e.g., `v0.5.1.mdx` becomes `/releases/v051/`).
- Any versioned release note (e.g., `v0.5.1.mdx`) **must explicitly define `slug` in frontmatter**:
  - Chinese: `slug: releases/v0.5.1`
  - English: `slug: en/releases/v0.5.1`
- `scripts/validate-release-metadata.mjs` enforces this via the `missing-or-mismatched-slug` rule.

### Diagram Pipeline (D2 to SVG)
- Diagram definitions are written in D2 format under `src/assets/diagrams/`:
  - Chinese diagrams: `*.d2` -> `public/images/diagrams/*.svg`
  - English diagrams: `*-en.d2` -> `public/images/diagrams/*-en.svg`
- Compiled by `scripts/build-diagrams.mjs`. If the D2 compiler CLI is absent in CI, the script gracefully falls back to committed SVGs.
- Diagrams must be entirely self-contained (no external fonts, CDN links, or insecure URLs; enforced by `tests/diagrams.test.mjs`).

### Public Content & Security Boundaries
All public documentation, examples, and tests must adhere to strict sanitization rules:
- **IP Addresses**: Strictly use RFC 5737 (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) or RFC 3849 (`2001:db8::/32`).
- **Hostnames**: Only `example.com`, `*.example.com`, `elkpi.com`, and `frp-tun.elkpi.com` are permitted.
- **Secrets & Keys**: Concrete WireGuard private keys and real frp tokens are forbidden. Always use `REPLACE_WITH_*` placeholders.
- **Allowed File Extensions**: `.sock`, `.key`, `.toml`, `.json`, `.mdx`, `.svg`, etc., are whitelisted in `scripts/validate-public-content.mjs`.

### Deployment
- Target domain is configured via `public/CNAME` (`frp-tun.elkpi.com`).
- Continuous Integration (`.github/workflows/ci.yml`) runs `check`, `test`, and `build` on every push to `main` and on pull requests.
- GitHub Pages Deployment (`.github/workflows/deploy-pages.yml`) runs on `workflow_dispatch` and requires repository variable `PUBLIC_RELEASE_APPROVED == 'true'`.
