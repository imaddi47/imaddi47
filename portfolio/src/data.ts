export type Link = {
  label: string;
  href: string;
};

export type System = {
  title: string;
  domain: string;
  summary: string;
  stack: string[];
  proof: string[];
  status: string;
  link?: Link;
  image?: {
    src: string;
    alt: string;
  };
};

export type Writing = {
  title: string;
  date: string;
  href: string;
  tags: string[];
};

export const profile = {
  name: "Ankit Kumar",
  handle: "imaddi47",
  email: "imaddi47@duck.com",
  headline:
    "Infrastructure-minded builder shipping cloud tools, operator platforms, and local-first AI workflows.",
  focus:
    "I work where product UX meets operations: AWS, VPNs, SSM, self-hosted automation, database tooling, and AI-assisted developer systems.",
  links: [
    { label: "GitHub", href: "https://github.com/imaddi47" },
    { label: "LinkedIn", href: "https://linkedin.com/in/imaddi47" },
    { label: "Medium", href: "https://medium.com/@imaddi47" },
    { label: "Email", href: "mailto:imaddi47@duck.com" },
  ],
};

export const signals = [
  { label: "Public repos", value: "22" },
  { label: "Core mode", value: "Infra product" },
  { label: "Writing lane", value: "DevOps incidents" },
  { label: "Build style", value: "Solo systems" },
];

export const systems: System[] = [
  {
    title: "OpenVPN Manager",
    domain: "Secure network operations",
    summary:
      "Full-stack admin plane and Go agent system for OpenVPN Community Edition.",
    stack: ["Go", "React", "PostgreSQL", "OpenVPN", "nftables", "WebSocket"],
    proof: [
      "Org-scoped users, clients, VPN nodes, groups, and RBAC.",
      "PKI workflows with encrypted key storage and CRL/config sync.",
      "Agent enrollment, command channel, audit log, and notification history.",
    ],
    status: "Local system case study",
  },
  {
    title: "AWS SSM Parameters UI",
    domain: "Cloud secrets operations",
    summary:
      "Local-first AWS Parameter Store manager with guarded reads and protected writes.",
    stack: ["React", "Vite", "Express", "AWS SDK", "SQLite"],
    proof: [
      "Browse, reveal, create, edit, and delete parameters across regions.",
      "Audited reveal gate and passphrase-protected write operations.",
      "Never logs or persists decrypted values.",
    ],
    status: "Public repo",
    link: {
      label: "GitHub",
      href: "https://github.com/imaddi47/manage-aws-ssm-parameters",
    },
    image: {
      src: "https://raw.githubusercontent.com/imaddi47/manage-aws-ssm-parameters/main/docs/screenshots/admin-ui.png",
      alt: "AWS SSM Parameters UI admin screen",
    },
  },
  {
    title: "Google Drive to S3 Copier",
    domain: "Cloud migration utility",
    summary:
      "Dual-pane Drive and S3 transfer tool with streaming multipart uploads.",
    stack: ["JavaScript", "Google Drive API", "AWS S3", "OAuth", "NDJSON"],
    proof: [
      "Drive on the left, S3 on the right, with selectable and renamable uploads.",
      "Streams files from Drive to S3 without disk staging.",
      "Supports AWS Global and China partitions.",
    ],
    status: "Public repo",
    link: {
      label: "GitHub",
      href: "https://github.com/imaddi47/copy-google-drive-to-aws-s3",
    },
  },
  {
    title: "Cloud IaC",
    domain: "AWS infrastructure layout",
    summary:
      "Terraform AWS structure for single-account, multi-environment infrastructure.",
    stack: ["Terraform", "AWS", "S3 state locking", "Shell"],
    proof: [
      "Environment split for development, staging, and production.",
      "Region-first layout with shared modules and bootstrap scripts.",
      "AI memory docs and decision logs for repeatable infra work.",
    ],
    status: "Local architecture case study",
  },
  {
    title: "Sidekick",
    domain: "Desktop AI workspace",
    summary:
      "Realtime desktop assistant for meetings, coding, calls, docs, and selected-screen context.",
    stack: ["Electron", "React", "Rust helpers", "Local RAG"],
    proof: [
      "Overlay-first workflow with screen context capture.",
      "Local audio transcription, AI Q&A, summaries, and memory.",
      "Provider choices for cloud, BYOK, and custom endpoints.",
    ],
    status: "Local product case study",
  },
  {
    title: "Resume Optimizer",
    domain: "AI product system",
    summary:
      "Open-source AI resume tailoring service with a FastAPI and Vue product stack.",
    stack: ["FastAPI", "Vue", "Gemini", "PostgreSQL", "LaTeX"],
    proof: [
      "Resume tailoring flow backed by structured backend services.",
      "PostgreSQL, Alembic, GCS, and payment integration direction.",
      "Public codebase with product-oriented architecture.",
    ],
    status: "Public repo",
    link: {
      label: "GitHub",
      href: "https://github.com/imaddi47/resume-optimizer",
    },
  },
];

export const secondarySystems: System[] = [
  {
    title: "SSM Manager",
    domain: "Instance access workspace",
    summary:
      "Cross-platform AWS Systems Manager workspace for tunnels, SSH, file transfer, and RDP direction.",
    stack: ["Node", "React", "Electron", "AWS SSM"],
    proof: ["Monorepo core/server/ui/app layout.", "Desktop and localhost app direction."],
    status: "Local system case study",
  },
  {
    title: "3D Globe Animation",
    domain: "Interactive visual system",
    summary:
      "React and Three.js dotted globe with GPU deformation and pointer physics.",
    stack: ["React", "Three.js", "R3F", "TypeScript"],
    proof: ["About 4,500 dots in one draw call.", "Drag, responsive behavior, and WebGL fallback."],
    status: "Public repo",
    link: {
      label: "GitHub",
      href: "https://github.com/imaddi47/3d-globe-animation",
    },
  },
  {
    title: "DBWrap",
    domain: "Database operations",
    summary:
      "Full-stack database management platform with GraphQL, auth, migrations, and typed data access.",
    stack: ["React", "Express", "Apollo", "PostgreSQL"],
    proof: ["Shared GraphQL schema.", "Backend logging, auth, migrations, and Docker workflow."],
    status: "Local system case study",
  },
];

export const writings: Writing[] = [
  {
    title: "I Let an AI Code For Me in a Disposable Docker Box - And It Slapped",
    date: "Apr 30, 2026",
    href: "https://imaddi47.medium.com/i-let-an-ai-code-for-me-in-a-disposable-docker-box-and-it-slapped-dd42ccbd0dba",
    tags: ["Claude Code", "Docker", "Cloudflare"],
  },
  {
    title: "Docker Desktop Doesn't Know How to Wait - And It Almost Killed My Homelab",
    date: "Apr 7, 2026",
    href: "https://imaddi47.medium.com/docker-desktop-doesnt-know-how-to-wait-and-it-almost-killed-my-homelab-82f307eccae1",
    tags: ["Docker", "Homelab", "macOS"],
  },
  {
    title: "When Macau Went Dark: How a Blocked CDN IP Led Us to Build a Geographic DNS Failover",
    date: "Mar 10, 2026",
    href: "https://imaddi47.medium.com/when-macau-went-dark-how-a-blocked-cdn-ip-led-us-to-build-a-geographic-dns-failover-992c5e59a5fc",
    tags: ["AWS", "DNS", "Failover"],
  },
  {
    title: "GitHub Actions Kept Failing Because of Cloudflare. Here's the Fix Nobody Talks About.",
    date: "Feb 26, 2026",
    href: "https://imaddi47.medium.com/github-actions-kept-failing-because-of-cloudflare-heres-the-fix-nobody-talks-about-1d2e824d7f44",
    tags: ["GitHub Actions", "Cloudflare", "Homelab"],
  },
  {
    title: "Practical Guide to Database Migrations",
    date: "Feb 2, 2026",
    href: "https://imaddi47.medium.com/practical-guide-to-database-migrations-aee1180dcdf5",
    tags: ["PostgreSQL", "Node.js", "Migrations"],
  },
];

export const skillGroups = [
  {
    title: "Cloud and Infrastructure",
    items: ["AWS", "Terraform", "Docker", "SSM", "Cloudflare Tunnel", "GitHub Actions"],
  },
  {
    title: "Secure Operations",
    items: ["OpenVPN", "nftables", "PKI", "RBAC", "Audit logs", "Encrypted storage"],
  },
  {
    title: "Backend and Data",
    items: ["Node.js", "Express", "FastAPI", "Go", "PostgreSQL", "GraphQL"],
  },
  {
    title: "Frontend and Product",
    items: ["React", "Vite", "Vue", "Tailwind", "Three.js", "Electron"],
  },
  {
    title: "AI and Automation",
    items: ["Gemini", "Codex", "Claude Code", "Local RAG", "Self-hosted agents"],
  },
];
