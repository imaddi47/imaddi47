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
};

// Featured work — the repos with real, sustained commit history (not one-off
// experiments). Commit counts as of the last GitHub walk-through.
export const projects: Project[] = [
  {
    id: "ssm-params",
    index: "I",
    title: "Manage AWS SSM Parameters",
    blurb:
      "A UI for the whole lifecycle of AWS Systems Manager parameters — list, edit, version, audit. Built because the console is fine and the CLI is faster, but neither is pleasant. ~50 commits and an ongoing docs/release effort behind it.",
    meta: { year: "2026", stack: ["JavaScript", "AWS SSM", "Web UI"], kind: "DevTool" },
    href: "https://github.com/imaddi47/manage-aws-ssm-parameters",
    status: "ongoing",
  },
  {
    id: "sso-todo",
    index: "II",
    title: "SSO Todo",
    blurb:
      "A todo app that exists mostly to get authentication right — SSO plus password login, sessions, the full flow — refined over ~37 commits and shipped in a container.",
    meta: { year: "2025", stack: ["JavaScript", "SSO / OAuth", "Docker"], kind: "Auth" },
    href: "https://github.com/imaddi47/sso-todo",
    status: "shipped",
  },
  {
    id: "three-d-globe",
    index: "III",
    title: "3D Globe Animation",
    blurb:
      "A WebGL globe — hand-written GLSL shaders, fiber arcs between coordinates, autorotate. A study in graphics, done for the joy of it.",
    meta: { year: "2026", stack: ["TypeScript", "Three.js", "GLSL"], kind: "WebGL" },
    href: "https://github.com/imaddi47/3d-globe-animation",
    status: "shipped",
  },
  {
    id: "slack-bot",
    index: "IV",
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
