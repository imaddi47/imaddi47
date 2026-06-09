# Ankit Kumar

Infrastructure-minded builder shipping cloud tools, internal platforms, and local-first AI workflows.

[GitHub](https://github.com/imaddi47) · [LinkedIn](https://linkedin.com/in/imaddi47) · [Medium](https://medium.com/@imaddi47) · [Email](mailto:imaddi47@duck.com)

## What I Build

I like the layer where product meets operations: AWS automation, VPN and SSM admin surfaces, self-hosted AI workflows, database tooling, and small systems that make repeated engineering work feel less fragile.

Right now I am focused on:

| Area | What that looks like |
| --- | --- |
| Cloud operations | AWS SSM tools, Drive to S3 migration flows, Terraform AWS environment structure |
| Secure admin systems | OpenVPN control planes, audit logs, RBAC, PKI, encrypted key storage |
| Local-first tools | localhost admin UIs, desktop assistants, self-hosted AI execution environments |
| Developer platforms | database management, migration workflows, workflow automation, internal dashboards |

## Featured Systems

| System | Focus | Stack |
| --- | --- | --- |
| OpenVPN Manager | Full-stack admin UI and Go agent system for OpenVPN Community Edition: org users, PKI, agent enrollment, config sync, audit logs, RBAC, notifications, and client access controls. | Go, React, PostgreSQL, OpenVPN, nftables, WebSocket |
| [AWS SSM Parameters UI](https://github.com/imaddi47/manage-aws-ssm-parameters) | Local-first Parameter Store manager with region discovery, audited reveal flow, passphrase-protected writes, SQLite audit log, and no decrypted value persistence. | React, Vite, Express, AWS SDK, SQLite |
| [Google Drive to S3 Copier](https://github.com/imaddi47/copy-google-drive-to-aws-s3) | Dual-pane Google Drive and S3 transfer UI with OAuth, selectable uploads, rename support, NDJSON progress, and streaming multipart uploads. | JavaScript, AWS S3, Google Drive API |
| Cloud IaC | Terraform AWS structure for single-account, multi-environment infrastructure with region-first layout and S3 native state locking. | Terraform, AWS, shell tooling |
| Sidekick | Desktop assistant for meetings, coding, calls, docs, selected-screen context, local transcription, AI Q&A, summaries, and local memory. | Electron, React, Rust helpers, local RAG |
| [Resume Optimizer](https://github.com/imaddi47/resume-optimizer) | Open-source AI resume tailoring service with FastAPI, Vue, Gemini, LaTeX, PostgreSQL, GCS, and payment flow. | FastAPI, Vue, Gemini, PostgreSQL |

## Writing

- [I Let an AI Code For Me in a Disposable Docker Box - And It Slapped](https://imaddi47.medium.com/i-let-an-ai-code-for-me-in-a-disposable-docker-box-and-it-slapped-dd42ccbd0dba)
- [Docker Desktop Doesn't Know How to Wait - And It Almost Killed My Homelab](https://imaddi47.medium.com/docker-desktop-doesnt-know-how-to-wait-and-it-almost-killed-my-homelab-82f307eccae1)
- [When Macau Went Dark: How a Blocked CDN IP Led Us to Build a Geographic DNS Failover](https://imaddi47.medium.com/when-macau-went-dark-how-a-blocked-cdn-ip-led-us-to-build-a-geographic-dns-failover-992c5e59a5fc)
- [GitHub Actions Kept Failing Because of Cloudflare. Here's the Fix Nobody Talks About.](https://imaddi47.medium.com/github-actions-kept-failing-because-of-cloudflare-heres-the-fix-nobody-talks-about-1d2e824d7f44)
- [Practical Guide to Database Migrations](https://imaddi47.medium.com/practical-guide-to-database-migrations-aee1180dcdf5)

## Stack

`AWS` · `Terraform` · `Docker` · `SSM` · `Cloudflare Tunnel` · `GitHub Actions` · `OpenVPN` · `nftables` · `Node.js` · `Express` · `FastAPI` · `Go` · `PostgreSQL` · `GraphQL` · `React` · `Vite` · `Vue` · `Tailwind` · `Three.js` · `Gemini` · `Codex` · `Claude Code` · `local RAG` · `PKI` · `RBAC` · `audit logs`

## Portfolio

The React portfolio lives in [`portfolio/`](./portfolio). It expands the README into a visual, case-study style site for infrastructure and operator-facing systems.
