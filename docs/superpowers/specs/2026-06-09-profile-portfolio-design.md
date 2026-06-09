# Profile README and Portfolio Design

Date: 2026-06-09
Status: Approved for spec writing via Telegram relay

## Goal

Refresh Ankit Kumar's GitHub profile into a sharper infrastructure, DevOps, solo builder, and entrepreneur narrative, then build a React portfolio that expands the strongest systems work into case studies.

The first screen should feel like an operator workspace, not a marketing splash page: precise, useful, calm, and credible. The README should be quick to scan on GitHub. The portfolio should carry the deeper proof.

## Source Rules

- Use verified evidence from local READMEs, GitHub metadata, Medium RSS, and explicit user-provided instructions.
- Use the LinkedIn URL as a contact link only unless authenticated content is provided later.
- Do not use the found `portfolio/public/resume.pdf` as user data because it is a template resume.
- Do not invent employers, dates, private metrics, client names, credentials, or revenue.
- Prefer concrete project capabilities over vague claims.

## Recommended Direction

Use the "Operator Systems Portfolio" direction.

The public story:

- Ankit builds infrastructure-facing product systems.
- The work spans AWS, VPNs, SSM tooling, self-hosting, database platforms, AI-assisted workflows, and developer/operator UX.
- The strongest proof comes from shipped tools and written incident-style engineering notes.

## README Design

The GitHub profile README should be short and durable. It should avoid the current large icon wall and generic "passionate developer" tone.

### Structure

1. Header
   - Name: `Ankit Kumar`
   - Positioning: infrastructure-minded builder shipping cloud tools, internal platforms, and local-first AI workflows.
   - Links: GitHub, LinkedIn, Medium, email.

2. Current focus
   - Cloud automation and AWS operations tooling.
   - VPN, SSM, and secure admin surfaces.
   - Self-hosted AI and developer workflow systems.
   - Database and migration tooling.

3. Featured systems
   - OpenVPN Manager: full-stack admin UI plus Go agent system for OpenVPN Community Edition.
   - SSM Manager: cross-platform AWS Systems Manager workspace with tunnels, SSH, file transfer, and RDP direction.
   - AWS SSM Parameters UI: local-first Parameter Store admin UI with audited reveal flow and protected writes.
   - Google Drive to S3 Copier: Drive and S3 side-by-side transfer UI with streaming uploads.
   - Cloud IaC: Terraform AWS multi-environment layout with region-first structure and native state locking.
   - Sidekick: desktop assistant for meetings, coding, calls, docs, screen context, and local memory.

4. Writing
   - Link recent Medium pieces that prove DevOps judgment: Docker Desktop/homelab, router persistence, geo DNS failover, GitHub Actions and Cloudflare, database migrations, schema-as-code.

5. Stack
   - Cloud and infrastructure: AWS, Terraform, Docker, SSM, Cloudflare Tunnel, GitHub Actions, OpenVPN, nftables.
   - Backend: Node.js, Express, FastAPI, Go, PostgreSQL, GraphQL, Better Auth.
   - Frontend: React, Vite, Vue, Tailwind, shadcn/ui, Three.js.
   - AI and automation: Gemini, OpenAI-compatible providers, Codex, Claude Code workflows, local RAG.
   - Security and operations: PKI, RBAC, audit logs, encrypted key storage, local-first privacy.

### README Visual Style

- Use Markdown that renders well on GitHub dark and light themes.
- Keep badges minimal and meaningful.
- Use compact tables only where they improve scanning.
- Avoid generated stat cards as the primary visual signal.
- Keep external images optional so the profile does not look broken when third-party image services are slow.

## React Portfolio Design

Create a static Vite React app under `portfolio/`.

The app should be data-driven. Content should live in one or two typed data modules so README and portfolio copy can stay consistent later.

### Primary Routes

Use a single-page portfolio for the first version:

- Hero and signal bar.
- Featured systems.
- Case study detail sections.
- Writing.
- Skill matrix.
- Contact footer.

Avoid a marketing landing page. The initial viewport should immediately show who Ankit is, what he builds, and the first proof points.

### Components

- `App`: page composition and layout.
- `Hero`: name, positioning, core links, and concise current focus.
- `SignalBar`: small metrics/facts that are already verified, such as public repos and active system categories. Avoid unverifiable years or employer claims.
- `SystemCard`: repeated project summary with domain, stack, evidence link, and operator-facing capability.
- `CaseStudy`: deeper sections for the strongest systems.
- `WritingList`: Medium posts with date, title, and topic tags.
- `SkillMatrix`: grouped technology capabilities.
- `ContactFooter`: email, GitHub, LinkedIn, Medium.

### Featured Case Studies

The first implementation should prioritize:

1. OpenVPN Manager
   - Reason: strongest full-system evidence.
   - Story: secure admin plane, org-scoped access, audit logs, PKI, Go agents, command channel, CRL/config sync, notification history, and tests.

2. AWS SSM Parameters UI
   - Reason: clean DevOps product surface.
   - Story: local admin UI, reveal gate, passphrase-protected writes, region discovery, SQLite audit log, and no decrypted value persistence.

3. Google Drive to S3 Copier
   - Reason: practical cloud migration utility.
   - Story: Drive/S3 dual-pane UI, OAuth, selectable uploads, rename support, NDJSON progress, multipart streaming without disk staging.

4. Cloud IaC
   - Reason: infrastructure architecture proof.
   - Story: Terraform AWS multi-environment structure, region-first layout, S3 native state locking, bootstrap scripts, and AI memory docs.

Secondary systems can appear in a compact grid:

- SSM Manager.
- Sidekick.
- Resume Optimizer / ATS Beater.
- 3D Globe Animation.
- DBWrap.
- Slack bot.

## Visual Direction

Use a restrained operator-dashboard aesthetic:

- Light neutral canvas with high-contrast text.
- Accent palette should mix green, cyan, amber, and graphite rather than a single purple, blue, tan, or slate family.
- Dense but breathable layout.
- 8px or smaller radius on cards and controls.
- Use real screenshots where available. For systems without screenshots, use simple code-native diagrams or structured UI panels rather than decorative blobs.
- Use lucide icons for small affordances if the package is installed.

The portfolio should feel like a practical control surface: readable tables, crisp labels, evidence links, and clear hierarchy.

## Data Flow

- Static content is stored in `portfolio/src/data/profile.ts`.
- Project entries include title, type, description, stack, source links, and evidence notes.
- Writing entries are copied from the Medium RSS snapshot gathered during discovery.
- No runtime scraping is required for v1.
- No secrets or private local paths should ship into the portfolio bundle.

## Error Handling

- External links open normally and remain human-readable if JavaScript fails.
- Images use alt text and layout-stable containers.
- If a screenshot asset is missing, the component falls back to a text evidence panel.
- Do not fail the app because an external image or badge service is unavailable.

## Testing and Verification

1. README
   - Scan for unverified claims.
   - Check GitHub-flavored Markdown readability.
   - Confirm all links are valid or intentionally pending.

2. Portfolio
   - Install dependencies only if needed.
   - Run the production build.
   - Start the dev server.
   - Use browser verification for desktop and mobile viewport screenshots.
   - Check for nonblank render, no overlapping text, stable card sizing, and readable mobile layout.

3. Source integrity
   - Ensure LinkedIn is linked but not scraped beyond accessible public content.
   - Ensure the template resume is not used as user content.
   - Ensure private or local-only implementation details are not exposed.

## Out of Scope for First Implementation

- CMS or runtime admin editing.
- Backend API.
- Live GitHub or Medium scraping in the deployed portfolio.
- Authentication.
- Contact form.
- Claims about employers, customers, revenue, or years of experience unless explicitly verified later.

## Implementation Notes

- Keep the profile README at repo root.
- Put the React site in `portfolio/` to avoid mixing generated app files with profile README assets.
- Prefer simple Vite plus React and TypeScript.
- Keep content modules small enough to review quickly.
- Keep styling local and maintainable; do not introduce a heavy design system unless the scaffold already includes one.
