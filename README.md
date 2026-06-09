<div align="center">

# Ankit Kumar

**Infrastructure-minded builder shipping cloud tools, secure operator platforms, and local-first AI workflows.**

[![GitHub](https://img.shields.io/badge/GitHub-imaddi47-0B1220?style=for-the-badge&logo=github&logoColor=white)](https://github.com/imaddi47)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-imaddi47-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/imaddi47)
[![Medium](https://img.shields.io/badge/Medium-Field_Notes-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@imaddi47)
[![Email](https://img.shields.io/badge/Email-imaddi47%40duck.com-FFD166?style=for-the-badge&logo=maildotru&logoColor=111111)](mailto:imaddi47@duck.com)

</div>

```txt
mode        infrastructure product + devops systems + solo shipping
current     AWS automation, OpenVPN control planes, SSM tools, local AI workflows
style       build the boring control surface, then make the dangerous path observable
```

## What I Build

I like the layer where product UX meets operations: tools that make cloud work, VPN access, secrets handling, database changes, and AI-assisted development less fragile.

| Lane | Proof of work |
| --- | --- |
| Cloud operations | AWS SSM tools, Drive to S3 transfer flows, Terraform environment structure |
| Secure admin systems | OpenVPN control planes, PKI flows, RBAC, audit logs, agent enrollment |
| Local-first tools | localhost admin UIs, desktop assistants, self-hosted AI execution environments |
| Developer platforms | database tooling, migration workflows, workflow automation, internal dashboards |

## Featured Systems

### OpenVPN Manager

Full-stack admin plane and Go agent system for OpenVPN Community Edition.

- Org-scoped users, clients, VPN nodes, groups, and RBAC.
- PKI workflows with encrypted key storage and CRL/config sync.
- Agent enrollment, command channel, audit log, and notification history.
- Stack: `Go` `React` `PostgreSQL` `OpenVPN` `nftables` `WebSocket`

### [AWS SSM Parameters UI](https://github.com/imaddi47/manage-aws-ssm-parameters)

Local-first AWS Parameter Store manager with guarded reads and protected writes.

- Browse, reveal, create, edit, and delete parameters across regions.
- Audited reveal gate and passphrase-protected write operations.
- No decrypted value persistence.
- Stack: `React` `Vite` `Express` `AWS SDK` `SQLite`

### [Google Drive to S3 Copier](https://github.com/imaddi47/copy-google-drive-to-aws-s3)

Dual-pane migration utility for moving Google Drive files into S3.

- Drive on the left, S3 on the right, with selectable and renamable uploads.
- Streams files from Drive to S3 without disk staging.
- Supports AWS Global and China partitions.
- Stack: `JavaScript` `Google Drive API` `AWS S3` `OAuth` `NDJSON`

### Cloud IaC + Local AI Workflows

Infrastructure and automation projects shaped around repeatable operations.

- Terraform AWS structure for single-account, multi-environment infrastructure.
- Sidekick-style desktop assistant experiments for screen context, transcription, local RAG, and summaries.
- Disposable AI coding environments and self-hosted developer workflows.
- Stack: `Terraform` `AWS` `Electron` `React` `Rust helpers` `local RAG`

## Operating Stack

| Area | Tools |
| --- | --- |
| Cloud and infra | `AWS` `Terraform` `Docker` `SSM` `Cloudflare Tunnel` `GitHub Actions` |
| Secure ops | `OpenVPN` `nftables` `PKI` `RBAC` `audit logs` `encrypted storage` |
| Backend and data | `Node.js` `Express` `FastAPI` `Go` `PostgreSQL` `GraphQL` |
| Frontend and product | `React` `Vite` `Vue` `Tailwind` `Three.js` `Electron` |
| AI and automation | `Gemini` `Codex` `Claude Code` `local RAG` `self-hosted agents` |

## Writing

- [I Let an AI Code For Me in a Disposable Docker Box - And It Slapped](https://imaddi47.medium.com/i-let-an-ai-code-for-me-in-a-disposable-docker-box-and-it-slapped-dd42ccbd0dba)
- [Docker Desktop Doesn't Know How to Wait - And It Almost Killed My Homelab](https://imaddi47.medium.com/docker-desktop-doesnt-know-how-to-wait-and-it-almost-killed-my-homelab-82f307eccae1)
- [When Macau Went Dark: How a Blocked CDN IP Led Us to Build a Geographic DNS Failover](https://imaddi47.medium.com/when-macau-went-dark-how-a-blocked-cdn-ip-led-us-to-build-a-geographic-dns-failover-992c5e59a5fc)
- [GitHub Actions Kept Failing Because of Cloudflare. Here's the Fix Nobody Talks About.](https://imaddi47.medium.com/github-actions-kept-failing-because-of-cloudflare-heres-the-fix-nobody-talks-about-1d2e824d7f44)
- [Practical Guide to Database Migrations](https://imaddi47.medium.com/practical-guide-to-database-migrations-aee1180dcdf5)

## Portfolio

The React portfolio lives in [`portfolio/`](./portfolio). It expands this README into a visual case-study site with a Three.js infrastructure graph, scroll tracker, command-stream hero, and operator-focused project sections.
