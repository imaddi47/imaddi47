export const meta = {
  name: "Ankit Kumar",
  handle: "imaddi47",
  role: "Software Engineer",
  company: "Toddle",
  location: "India",
  timezone: "Asia/Kolkata",
  email: "imaddi47@duck.com",
  blog: "https://blog.debugblackbox.com",
  github: "https://github.com/imaddi47",
  linkedin: "https://linkedin.com/in/imaddi47",
  medium: "https://medium.com/@imaddi47",
};

export const tagline =
  "Software engineer building tooling for the unglamorous middle of the stack — auth flows, AWS plumbing, AI-augmented workflows. The things that ship at 2 a.m. and quietly hold.";

export const bio = `Five years of shipping production JavaScript, TypeScript, and Python. Currently at Toddle, where the work is mostly Postgres, Node, and the long tail of edge cases that come with serving schools across timezones. Off-hours, I make small developer tools and write about the ones that didn't work.`;

export type Project = {
  id: string;
  index: string; // roman numeral
  title: string;
  blurb: string;
  meta: { year: string; stack: string[]; kind: string };
  href: string;
  status: "shipped" | "ongoing" | "archived";
};

export const projects: Project[] = [
  {
    id: "resume-optimizer",
    index: "I",
    title: "Resume Optimizer",
    blurb:
      "Open-source AI service that tailors resumes to job descriptions. FastAPI orchestrates Gemini for the rewrite, LaTeX for the typeset, Vue for the upload UI.",
    meta: { year: "2026", stack: ["FastAPI", "Vue 3", "Gemini", "LaTeX"], kind: "AI / Tooling" },
    href: "https://github.com/imaddi47/resume-optimizer",
    status: "ongoing",
  },
  {
    id: "ssm-params",
    index: "II",
    title: "Manage AWS SSM Parameters",
    blurb:
      "A UI for the lifecycle of AWS Systems Manager parameters — list, edit, version, audit. Built because the console is fine and the CLI is faster, but neither is pleasant.",
    meta: { year: "2026", stack: ["JavaScript", "AWS SDK", "React"], kind: "DevTool" },
    href: "https://github.com/imaddi47/manage-aws-ssm-parameters",
    status: "shipped",
  },
  {
    id: "dbverse",
    index: "III",
    title: "DBverse",
    blurb:
      "A small abstraction over Postgres, CockroachDB, and SQLite for projects that outgrow one database and aren't ready for an ORM. Mostly a learning surface for query planners.",
    meta: { year: "2025", stack: ["TypeScript", "Postgres", "Knex"], kind: "Library" },
    href: "https://github.com/imaddi47/dbverse",
    status: "ongoing",
  },
  {
    id: "wireguard-backend",
    index: "IV",
    title: "Wireguard Backend",
    blurb:
      "A REST API for managing WireGuard peers — keys, allowed IPs, QR provisioning. The kind of thing you write once and never have to think about again.",
    meta: { year: "2025", stack: ["Node.js", "WireGuard", "Linux"], kind: "Infra" },
    href: "https://github.com/imaddi47/wireguard-backend",
    status: "shipped",
  },
  {
    id: "three-d-globe",
    index: "V",
    title: "3D Globe Animation",
    blurb:
      "A vibe-coded experiment in WebGL — earth, fiber arcs between coordinates, autorotate. Small, useless, and good.",
    meta: { year: "2026", stack: ["TypeScript", "Three.js", "WebGL"], kind: "Sketch" },
    href: "https://github.com/imaddi47/3d-globe-animation",
    status: "shipped",
  },
];

export const stack = {
  daily: ["TypeScript", "Node", "Postgres", "React"],
  often: ["Python", "FastAPI", "AWS (S3, SSM, Lambda)", "Docker"],
  curious: ["Rust", "Bun", "Deno", "Cloudflare Workers"],
  loved: ["Vim motions", "ripgrep", "tmux", "Linear"],
};

export const now = [
  { label: "Building", text: "Resume Optimizer v2 — adding multi-format export." },
  { label: "Reading", text: "“Designing Data-Intensive Applications”, Kleppmann." },
  { label: "Listening", text: "Nils Frahm — All Melody. Endlessly." },
  { label: "Learning", text: "Rust, slowly. One small CLI at a time." },
];

export const writings = [
  {
    title: "Why your migrations need a rollback you'll never run",
    excerpt:
      "A short note on writing reversible migrations even when you're certain you won't roll back.",
    date: "Apr 2026",
    href: "https://blog.debugblackbox.com",
  },
  {
    title: "The middle of the stack is where careers are made",
    excerpt:
      "An argument for spending more time on the part nobody demos: jobs, queues, idempotency, retries.",
    date: "Feb 2026",
    href: "https://blog.debugblackbox.com",
  },
  {
    title: "On choosing boring databases",
    excerpt:
      "Postgres, again. Why I keep reaching for it even when something newer would fit.",
    date: "Nov 2025",
    href: "https://blog.debugblackbox.com",
  },
];
