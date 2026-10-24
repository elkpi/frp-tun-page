# frp-tun Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, Chinese-first frp-tun documentation and preview-release site that can be safely validated in `elkpi/frp-tun-page` without publishing the closed-source core or enabling downloads.

**Architecture:** Astro and Starlight generate a fully static documentation site with root Chinese content and English core pages. Local Node scripts generate Mermaid SVG diagrams and reject unsafe public material before every test/build. CI builds and verifies only; a separately protected Pages workflow requires an explicit repository approval variable, so the unfinished legal release state cannot accidentally become a public deployment.

**Tech Stack:** Node.js 22, npm, Astro, Starlight, TypeScript, Node.js built-in test runner, Mermaid CLI, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-23-frp-tun-public-site-design.md`

## Global Constraints

- Keep `elkpi/frp-tun` private; this repository must not contain Go core source, internal CI, production baselines, `output/`, or real deployment material.
- Use `https://frp-tun.elkpi.com` as the only eventual public domain, with GitHub Pages and no external runtime services or CDNs.
- Do not publicly deploy Pages or create a downloadable Release before legal issuer identity, legal/security addresses, governing law, EULA, and CC BY attribution are supplied.
- Initial binary release remains a future `v0.6.0-preview.1`-style preview; no current site text may claim that any binary is released, stable, supported, or hardware-verified.
- All public content must be Chinese-first, with English core pages, explicit preview/closed-source/no-auto-update boundaries, and version applicability.
- Use only RFC 5737/3849 documentation addresses, `example.com`, and clearly nonfunctional placeholder credentials in examples.
- Generated SVGs are built locally from Mermaid source and must not be manually edited or fetched at runtime.
- Normal CI and Pages build use GitHub-hosted ephemeral runners. The public repository must have no self-hosted runner, private source access, production network access, or release credentials.

## Review Focus

- A WireGuard private key, frp credential, private IP, real host name, or real non-`example.com` endpoint in a public file must fail validation; test this in Task 2.
- Legitimate RFC 5737/3849 addresses, loopback examples, `example.com`, and explicit `REPLACE_WITH_*` placeholders must pass validation; test this in Task 2.
- A Mermaid source file missing a generated SVG, or a generated SVG without page-level alternative text, must fail the diagram/content checks; test this in Task 3 and Task 4.
- A malformed preview Release Notes page or one omitting the verification/known-limitations/rollback boundary must fail metadata validation; test this in Task 5.
- A missing or non-`true` `PUBLIC_RELEASE_APPROVED` repository variable must cause Pages deployment to be skipped rather than publishing any site; pin this condition in Task 6 workflow review.

---

## File Structure

- `package.json`: reproducible Node scripts and pinned development dependency ranges.
- `astro.config.mjs`, `tsconfig.json`, `src/styles/custom.css`: Starlight configuration, Chinese-first localisation, branding and accessible responsive styling.
- `src/content/docs/`: versioned Chinese root content and English core documentation pages.
- `src/assets/diagrams/*.mmd`: authoritative Mermaid source for the three topology diagrams.
- `public/images/diagrams/*.svg`: generated topology diagrams committed to make local documentation preview independent of browser-side Mermaid.
- `scripts/build-diagrams.mjs`: deterministic Mermaid CLI wrapper.
- `scripts/validate-public-content.mjs`: file walker and content safety validator.
- `scripts/validate-release-metadata.mjs`: preview Release Notes contract validator.
- `tests/*.test.mjs`: focused tests for validators and diagram inventory.
- `.github/workflows/ci.yml`: build/test workflow on GitHub-hosted runners.
- `.github/workflows/deploy-pages.yml`: manually dispatched, guarded GitHub Pages workflow.
- `.github/ISSUE_TEMPLATE/*`, `.github/DISCUSSION_TEMPLATE/*`: redaction-aware public-support entry points.
- `public/CNAME`: desired eventual domain only; it does not itself authorize deployment.

### Task 1: Scaffold the static site and establish preview-safe global UI

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/custom.css`
- Create: `src/content/docs/index.mdx`
- Create: `src/content/docs/en/index.mdx`
- Create: `src/content/docs/getting-started/index.mdx`
- Create: `src/content/docs/en/getting-started/index.mdx`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: `npm run dev`, `npm run check`, `npm run test`, `npm run build`, `npm run validate:content`, `npm run validate:releases`, and `npm run diagrams` scripts.
- Produces: Starlight routes rooted at `/` (Chinese) and `/en/` (English).
- Consumes: static diagrams at `/images/diagrams/<name>.svg` from Task 3.

- [ ] **Step 1: Create `package.json` with the scripts and development dependencies required by this plan**

  Use Node 22/npm, Astro, `@astrojs/starlight`, TypeScript, Vitest, Mermaid CLI and a static content test command. `prebuild` must run diagram generation and both validators before `astro build`.

- [ ] **Step 2: Install the declared dependencies and generate `package-lock.json`**

  Run: `npm install`

  Expected: lockfile is created and `npm` reports no installation failure.

- [ ] **Step 3: Configure Starlight in `astro.config.mjs` and add Chinese-first preview pages**

  Configure Chinese root and English locale, sidebar labels, title `frp-tun`, site URL `https://frp-tun.elkpi.com`, local custom CSS, and a clear site-wide preview status. The landing pages must state closed-source status, no public download yet, no automatic update, and a link to safety boundaries.

- [ ] **Step 4: Run static type/content validation**

  Run: `npm run check`

  Expected: PASS with all root and English pages recognised.

- [ ] **Step 5: Commit the scaffold and preview-safe landing pages**

  ```bash
  git add package.json package-lock.json astro.config.mjs tsconfig.json src .gitignore README.md
  git commit -m "feat: scaffold frp-tun preview documentation site"
  ```

### Task 2: Build and test the public-content safety validator

**Files:**
- Create: `scripts/validate-public-content.mjs`
- Create: `tests/validate-public-content.test.mjs`
- Create: `tests/fixtures/safe-config.toml`
- Create: `tests/fixtures/unsafe-private-key.toml`
- Create: `tests/fixtures/unsafe-frp-token.toml`
- Create: `tests/fixtures/unsafe-private-address.md`

**Interfaces:**
- Produces: `validatePublicContent({ roots: string[] }): ValidationResult` exported from `scripts/validate-public-content.mjs`, where `ValidationResult` contains `violations: Array<{file: string, line: number, rule: string}>`.
- Consumes: source/docs/public roots and reusable fixture roots.
- Produces: exit code 0 for no violations and nonzero with file/line/rule diagnostics for violations.

- [ ] **Step 1: Write failing validator tests for safe examples and prohibited material**

  Cover an allowed configuration containing `198.51.100.10`, `2001:db8::10`, `relay.example.com`, and `REPLACE_WITH_PRIVATE_KEY`; reject a non-placeholder WireGuard private key, `token`/`shared_secret` assignment with a non-placeholder value, and RFC 1918 address.

- [ ] **Step 2: Run the validator test file to verify it fails**

  Run: `npm test -- tests/validate-public-content.test.mjs`

  Expected: FAIL because the validator export does not exist.

- [ ] **Step 3: Implement `validatePublicContent({ roots })` in `scripts/validate-public-content.mjs`**

  Walk only text extensions used by public material. Allow loopback and RFC 5737/3849 documentation ranges; reject concrete credentials, RFC 1918 addresses, known production paths (`output/`, `artifacts/config/`) and non-example hostnames. Treat `REPLACE_WITH_*`, `${...}`, `example` tokens and documented public keys as placeholders, not secrets.

- [ ] **Step 4: Run validator tests and repository content validation**

  Run: `npm test -- tests/validate-public-content.test.mjs && npm run validate:content`

  Expected: PASS.

- [ ] **Step 5: Commit safety validation**

  ```bash
  git add scripts/validate-public-content.mjs tests/validate-public-content.test.mjs tests/fixtures package.json
  git commit -m "feat: validate public documentation content"
  ```

### Task 3: Generate and verify static topology diagrams

**Files:**
- Create: `src/assets/diagrams/direct-fallback.mmd`
- Create: `src/assets/diagrams/two-site-gateway.mmd`
- Create: `src/assets/diagrams/private-relay-hub-spoke.mmd`
- Create: `scripts/build-diagrams.mjs`
- Create: `public/images/diagrams/direct-fallback.svg`
- Create: `public/images/diagrams/two-site-gateway.svg`
- Create: `public/images/diagrams/private-relay-hub-spoke.svg`
- Create: `tests/diagrams.test.mjs`

**Interfaces:**
- Produces: `npm run diagrams`, which maps every `.mmd` source to a same-name SVG in `public/images/diagrams` and fails if Mermaid CLI cannot render a source.
- Consumes: local Mermaid CLI only; no network URL or browser-side rendering.
- Produces: three named diagrams used by Task 4 pages.

- [ ] **Step 1: Write a failing diagram inventory test**

  Assert the exact three Mermaid source names exist, each has a nonempty SVG output after `npm run diagrams`, and each SVG contains no `http://` or `https://` asset reference.

- [ ] **Step 2: Run the diagram test to verify it fails**

  Run: `npm test -- tests/diagrams.test.mjs`

  Expected: FAIL because sources and the generation script are absent.

- [ ] **Step 3: Implement the Mermaid sources and `scripts/build-diagrams.mjs`**

  Use Chinese labels and semantic groups for encrypted WireGuard traffic, carrier transport, P2P path selection, STCP fallback, policy routing and private relay. Invoke the local Mermaid CLI with a project-local configuration and emit SVG files deterministically.

- [ ] **Step 4: Generate diagrams and run the inventory test**

  Run: `npm run diagrams && npm test -- tests/diagrams.test.mjs`

  Expected: PASS with exactly three local SVGs.

- [ ] **Step 5: Commit diagram sources, outputs and checks**

  ```bash
  git add src/assets/diagrams scripts/build-diagrams.mjs public/images/diagrams tests/diagrams.test.mjs package.json
  git commit -m "feat: add static frp-tun topology diagrams"
  ```

### Task 4: Write versioned technical documentation and safe configuration examples

**Files:**
- Create: `src/content/docs/architecture/index.mdx`
- Create: `src/content/docs/architecture/direct-fallback.mdx`
- Create: `src/content/docs/architecture/two-site-gateway.mdx`
- Create: `src/content/docs/architecture/private-relay.mdx`
- Create: `src/content/docs/configuration/index.mdx`
- Create: `src/content/docs/configuration/minimal-two-site.mdx`
- Create: `src/content/docs/configuration/dual-stack-qos.mdx`
- Create: `src/content/docs/configuration/openwrt.mdx`
- Create: `src/content/docs/operations/index.mdx`
- Create: `src/content/docs/operations/upgrade-rollback.mdx`
- Create: `src/content/docs/operations/troubleshooting.mdx`
- Create: `src/content/docs/security/index.mdx`
- Create: `src/content/docs/en/architecture/index.mdx`
- Create: `src/content/docs/en/configuration/index.mdx`
- Create: `src/content/docs/en/security/index.mdx`

**Interfaces:**
- Consumes: Task 2 validator and Task 3 SVG paths.
- Produces: page frontmatter fields `title`, `description`, and `version: "preview"`; architecture pages additionally contain an image alt string and a local SVG reference.
- Produces: explicit configuration warnings and test-status labels used by the Release Notes in Task 5.

- [ ] **Step 1: Add a failing content-contract test for diagrams and warning text**

  Assert each architecture page refers to exactly one expected local SVG and provides both Chinese and English explanation paths. Assert each configuration page includes an “适用版本”/“Applicable version” label, a preview warning, and no download command.

- [ ] **Step 2: Run the content-contract test to verify it fails**

  Run: `npm test -- tests/documentation-contract.test.mjs`

  Expected: FAIL because the documentation pages do not exist.

- [ ] **Step 3: Implement the Chinese-first pages and English core counterparts**

  Use only safe placeholders. Explain that WireGuard encrypts before carrier transport; state P2P first/STCP fallback as a path-selection design, not a guarantee. Mark OpenWrt, nonzero `SO_MARK`, long-load, WAN/netem and public NAT traversal as unverified/experimental unless future evidence is added. Include manual upgrade and rollback commands as generic templates, not live binary URLs.

- [ ] **Step 4: Run documentation contract and content safety validation**

  Run: `npm test -- tests/documentation-contract.test.mjs && npm run validate:content`

  Expected: PASS.

- [ ] **Step 5: Commit technical documentation and configuration examples**

  ```bash
  git add src/content/docs tests/documentation-contract.test.mjs
  git commit -m "docs: add preview architecture and deployment guidance"
  ```

### Task 5: Add evidence-driven preview Release Notes and public-support templates

**Files:**
- Create: `src/content/docs/releases/index.mdx`
- Create: `src/content/docs/releases/v0.6.0-preview.1.mdx`
- Create: `src/content/docs/security/privacy.mdx`
- Create: `src/content/docs/security/support-and-disclosure.mdx`
- Create: `scripts/validate-release-metadata.mjs`
- Create: `tests/validate-release-metadata.test.mjs`
- Create: `.github/ISSUE_TEMPLATE/bug-report.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`
- Create: `.github/DISCUSSION_TEMPLATE/q-and-a.yml`

**Interfaces:**
- Produces: `validateReleaseMetadata({ root: string }): ReleaseValidationResult` exporting `violations` with file/section diagnostics.
- Consumes: MDX release pages with `version`, `status: preview`, and `published: false` frontmatter.
- Produces: no actual binary URL, EULA, legal identity, security mailbox, or false release assertion.

- [ ] **Step 1: Write failing metadata tests**

  Require every preview release page to contain sections for Summary, Verified scope, Known limitations, Upgrade, Rollback, Verification, and Revocation; require `published: false`; reject text that calls unverified OpenWrt or NAT tests supported.

- [ ] **Step 2: Run the metadata test to verify it fails**

  Run: `npm test -- tests/validate-release-metadata.test.mjs`

  Expected: FAIL because no validator or release page exists.

- [ ] **Step 3: Implement the metadata validator, preview Release Notes, policy pages and GitHub templates**

  The preview page must show a release-readiness state rather than an asset link. Support/security pages must direct users away from posting secrets and say the disclosure contact will be published only when legally approved. Issue templates require environment/version/reproduction fields and a redaction checklist.

- [ ] **Step 4: Run metadata and full content validation**

  Run: `npm test -- tests/validate-release-metadata.test.mjs && npm run validate:releases && npm run validate:content`

  Expected: PASS.

- [ ] **Step 5: Commit preview release information and support guards**

  ```bash
  git add src/content/docs/releases src/content/docs/security scripts/validate-release-metadata.mjs tests/validate-release-metadata.test.mjs .github package.json
  git commit -m "docs: add gated preview release information"
  ```

### Task 6: Add CI, guarded Pages deployment, and repository release boundaries

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `public/CNAME`
- Create: `RELEASE_READINESS.md`
- Create: `SECURITY.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm ci`, `npm run check`, `npm test`, and `npm run build` from Tasks 1–5.
- Produces: CI jobs that run only on `ubuntu-24.04` GitHub-hosted runners.
- Produces: a manually dispatched deployment workflow where each deployment job is gated by `vars.PUBLIC_RELEASE_APPROVED == 'true'`, requests only `contents: read`, `pages: write`, and `id-token: write`, and binds to a `github-pages` environment.
- Produces: `RELEASE_READINESS.md` as the human release checklist and hard legal gate record.

- [ ] **Step 1: Write workflow policy assertions in `tests/workflow-policy.test.mjs`**

  Read the workflow YAML as text and assert no `self-hosted`, no private repository URL, no secret reference, CI uses `ubuntu-24.04`, and the deploy workflow contains both manual dispatch and the exact `PUBLIC_RELEASE_APPROVED == 'true'` job condition.

- [ ] **Step 2: Run workflow policy test to verify it fails**

  Run: `npm test -- tests/workflow-policy.test.mjs`

  Expected: FAIL because workflows are absent.

- [ ] **Step 3: Implement CI and guarded deployment workflows plus release-boundary documents**

  `ci.yml` runs only validation and static build. `deploy-pages.yml` must never run on push and must use GitHub Pages official configure/upload/deploy actions after the approval condition. Put `frp-tun.elkpi.com` in `public/CNAME`. State in `RELEASE_READINESS.md` that legal identity, legal/security contacts, governing law, EULA/CC BY attribution, third-party license audit, signed assets, domain validation and 48-hour cooling period are all unmet hard gates.

- [ ] **Step 4: Run workflow policy tests, static checks, test suite, and production build**

  Run: `npm test -- tests/workflow-policy.test.mjs && npm run check && npm test && npm run build`

  Expected: PASS. The build is local-only and no Pages deployment runs.

- [ ] **Step 5: Commit deployment safety controls and release readiness checklist**

  ```bash
  git add .github public/CNAME RELEASE_READINESS.md SECURITY.md README.md tests/workflow-policy.test.mjs
  git commit -m "ci: add guarded pages deployment workflow"
  ```

### Task 7: Perform final release-site verification and record the private-preview state

**Files:**
- Modify: `README.md`
- Modify: `RELEASE_READINESS.md`
- Test: generated `dist/` output (not committed)

**Interfaces:**
- Consumes: all task scripts and generated Astro output.
- Produces: a checked private-preview site build and clear operator instructions for the unresolved gates.

- [ ] **Step 1: Verify that generated site output contains no external runtime script or image URL**

  Run: `npm run build && ! grep -R -E 'https?://(cdn|unpkg|jsdelivr|mermaid)' dist`

  Expected: PASS.

- [ ] **Step 2: Verify no forbidden production source paths or obvious secret fields are tracked**

  Run: `git ls-files | grep -E '(^output/|^artifacts/config/)' && exit 1 || true; ! git grep -nE '(PrivateKey\s*=|shared_secret\s*=|token\s*=)' -- ':!tests/fixtures/*'`

  Expected: PASS.

- [ ] **Step 3: Review all release blockers against `RELEASE_READINESS.md` and mark only verified local checks complete**

  Leave legal identity, legal/security contacts, governing law, EULA/CC BY attribution, third-party license audit, domain validation, signed binary assets and the 48-hour cooling period unchecked. Do not claim public release readiness.

- [ ] **Step 4: Commit final documentation verification state**

  ```bash
  git add README.md RELEASE_READINESS.md
  git commit -m "docs: record preview release readiness gates"
  ```

## Self-Review

- **Spec coverage:** Tasks 1 and 4 cover bilingual Chinese-first static documentation; Tasks 2–3 cover secret safety and local SVG topology assets; Task 5 covers evidence-driven preview notes/support/privacy; Task 6 covers GitHub-hosted CI, manual Pages gate and CNAME; Task 7 preserves all unresolved legal and release gates. No requirement is intentionally omitted.
- **Step scan:** Each task starts with a focused failure, implements one interface, then runs a concrete command. Content writing is grouped by user-visible documentation boundary rather than individual Markdown files.
- **Type consistency:** `ValidationResult`/`ReleaseValidationResult` use the same `{ violations }` shape; npm scripts introduced in Task 1 are consumed without renamed commands by later tasks; all diagram file names match their Task 3 outputs and Task 4 references.
- **Review focus:** Every listed failure mode is assigned to Task 2, 3/4, 5, or 6 and has an explicit test step.
- **Proportion:** The plan makes decisions about public-release safety and static-site interfaces while leaving routine page prose, CSS layout details, and implementation internals to the executor.
