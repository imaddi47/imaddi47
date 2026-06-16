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

// Curated live products (closed-source). Edit by hand — these aren't on GitHub.
const products: Project[] = [
  {
    id: "ssmdojo",
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
    title: "OpenVPN Manager",
    blurb:
      "Provision and manage OpenVPN servers and peers from a UI — keys, profiles and access, without the config-file archaeology.",
    meta: { year: "2026", stack: ["OpenVPN", "TypeScript", "Self-host"], kind: "Product" },
    href: "https://vpn.lonebuilder.com",
    logo: "https://www.google.com/s2/favicons?domain=vpn.lonebuilder.com&sz=128",
    live: true,
    status: "ongoing",
  },
];

// Open-source repos. Run `pnpm sync:projects` to pull the latest from GitHub and
// paste fresh entries between the markers (the script prints, it won't edit this).
// <auto:projects>
const repos: Project[] = [
  {
    id: "manage-aws-ssm-parameters",
    title: "Manage AWS SSM Parameters",
    blurb:
      "The open-source core behind SSM Dojo — a UI for the whole lifecycle of SSM parameters. ~50 commits and an ongoing docs/release effort behind it.",
    meta: { year: "2026", stack: ["JavaScript", "AWS SSM", "Web UI"], kind: "DevTool" },
    href: "https://github.com/imaddi47/manage-aws-ssm-parameters",
    status: "ongoing",
  },
  {
    id: "three-d-globe",
    title: "3D Globe Animation",
    blurb:
      "A WebGL globe — hand-written GLSL shaders, fiber arcs between coordinates, autorotate. Built mostly for the fun of it.",
    meta: { year: "2026", stack: ["TypeScript", "Three.js", "GLSL"], kind: "WebGL" },
    href: "https://github.com/imaddi47/3d-globe-animation",
    status: "shipped",
  },
];
// </auto:projects>

export const projects: Project[] = [...products, ...repos];

export const stack = {
  daily: ["TypeScript", "Node", "Postgres", "React"],
  often: ["Python", "FastAPI", "AWS (S3, SSM, Lambda)", "Docker"],
  curious: ["Rust", "Bun", "Deno", "Cloudflare Workers"],
  loved: ["Vim motions", "ripgrep", "tmux", "Linear"],
};

export const now = [
  { label: "Building", text: "SSM Dojo — docs and a release flow for the SSM parameter manager." },
  { label: "Reading", text: "“Designing Data-Intensive Applications”, Kleppmann." },
  { label: "Listening", text: "Nils Frahm — All Melody, on repeat." },
  { label: "Learning", text: "Rust, slowly. One small CLI at a time." },
];

// Pulled from the blog feed — refresh with `pnpm sync:writing`.
export const writings = [
  {
    title: "I Let an AI Code For Me in a Disposable Docker Box — And It Slapped",
    excerpt:
      "Running Claude Code in a throwaway Docker box instead of on my laptop — the setup, and why it worked better than I expected.",
    date: "May 2026",
    href: "https://imaddi47.medium.com/i-let-an-ai-code-for-me-in-a-disposable-docker-box-and-it-slapped-dd42ccbd0dba",
  },
  {
    title: "Docker Desktop Doesn’t Know How to Wait — And It Almost Killed My Homelab",
    excerpt:
      "A race condition between Docker Desktop and a slow RAID1 mount that nearly took out my homelab.",
    date: "Apr 2026",
    href: "https://imaddi47.medium.com/docker-desktop-doesnt-know-how-to-wait-and-it-almost-killed-my-homelab-82f307eccae1",
  },
  {
    title: "Your Router Has the Memory of a Goldfish — Here’s the Fix",
    excerpt:
      "Why ISP routers keep forgetting your DHCP reservations, and how to make them actually stick.",
    date: "Apr 2026",
    href: "https://imaddi47.medium.com/your-router-has-the-memory-of-a-goldfish-heres-the-fix-f2f648bf5bf9",
  },
  {
    title: "When Macau Went Dark: How a Blocked CDN IP Led Us to Build a Geographic DNS Failover",
    excerpt:
      "A blocked CDN IP knocked a client offline in Macau — the war story, and the geo-DNS failover we built to fix it.",
    date: "Mar 2026",
    href: "https://imaddi47.medium.com/when-macau-went-dark-how-a-blocked-cdn-ip-led-us-to-build-a-geographic-dns-failover-992c5e59a5fc",
  },
];
