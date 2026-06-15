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

export type Project = {
  id: string;
  index: string; // roman numeral
  title: string;
  blurb: string;
  meta: { year: string; stack: string[]; kind: string };
  href: string;
  status: "shipped" | "ongoing" | "archived";
  /** Live product (closed-source); href is a direct link, not a repo. */
  live?: boolean;
  /** Logo image (favicon); falls back to a monogram if it doesn't load. */
  logo?: string;
};

// Featured work — products with a live link first, then the open repos with real,
// sustained commit history. Logos use each site's favicon (monogram fallback).
export const projects: Project[] = [
  {
    id: "ssmdojo",
    index: "I",
    title: "SSM Dojo",
    blurb:
      "The hosted product: manage AWS SSM parameters end-to-end from a clean UI — list, edit, version and audit across accounts. The open-source core lives below.",
    meta: { year: "2026", stack: ["AWS SSM", "TypeScript", "SaaS"], kind: "Product" },
    href: "https://ssmdojo.com",
    logo: "https://www.google.com/s2/favicons?domain=ssmdojo.com&sz=128",
    live: true,
    status: "ongoing",
  },
  {
    id: "openvpn-manager",
    index: "II",
    title: "OpenVPN Manager",
    blurb:
      "Provision and manage OpenVPN servers and peers from a UI — keys, profiles and access, without the config-file archaeology.",
    meta: { year: "2026", stack: ["OpenVPN", "TypeScript", "Self-host"], kind: "Product" },
    href: "https://vpn.lonebuilder.com",
    logo: "https://www.google.com/s2/favicons?domain=vpn.lonebuilder.com&sz=128",
    live: true,
    status: "ongoing",
  },
  {
    id: "ssm-params",
    index: "III",
    title: "Manage AWS SSM Parameters",
    blurb:
      "The open-source core behind SSM Dojo — a UI for the whole lifecycle of SSM parameters. ~50 commits and an ongoing docs/release effort behind it.",
    meta: { year: "2026", stack: ["JavaScript", "AWS SSM", "Web UI"], kind: "DevTool" },
    href: "https://github.com/imaddi47/manage-aws-ssm-parameters",
    status: "ongoing",
  },
  {
    id: "sso-todo",
    index: "IV",
    title: "SSO Todo",
    blurb:
      "A todo app that exists mostly to get authentication right — SSO plus password login, sessions, the full flow — refined over ~37 commits and shipped in a container.",
    meta: { year: "2025", stack: ["JavaScript", "SSO / OAuth", "Docker"], kind: "Auth" },
    href: "https://github.com/imaddi47/sso-todo",
    status: "shipped",
  },
  {
    id: "three-d-globe",
    index: "V",
    title: "3D Globe Animation",
    blurb:
      "A WebGL globe — hand-written GLSL shaders, fiber arcs between coordinates, autorotate. A study in graphics, done for the joy of it.",
    meta: { year: "2026", stack: ["TypeScript", "Three.js", "GLSL"], kind: "WebGL" },
    href: "https://github.com/imaddi47/3d-globe-animation",
    status: "shipped",
  },
  {
    id: "slack-bot",
    index: "VI",
    title: "Slack Bot",
    blurb:
      "A Slack bot that absorbs the repetitive team chores — the small automations that save a dozen context switches a day. Dockerized and iterated on over a few weeks.",
    meta: { year: "2025", stack: ["JavaScript", "Slack API", "Docker"], kind: "Automation" },
    href: "https://github.com/imaddi47/slack-bot",
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
  { label: "Building", text: "SSM Dojo — docs and a release flow around the AWS SSM parameter manager." },
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
