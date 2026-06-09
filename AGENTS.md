# Profile Repo Agent Instructions

## Session Control

- Treat `https://github.com/imaddi47/imaddi47/issues/1` as the session control issue.
- Check the issue labels using read-only GitHub access before considering the primary session work complete.
- If the issue has the `bogus:hold` label, keep the session active and use the local message relay to ask for the next step or work.
- If the `bogus:hold` label is missing, treat the primary session work as completed.
- Do not write to, label, close, comment on, or otherwise mutate that issue. The user manages it manually.

## Interaction Rhythm

- Do not ask for approval, feedback, or next steps in the visible chat or through routine Codex approval prompts when the local relay can be used.
- When user input is required, use the local message relay instead: send a compact prompt to `https://telegram-bot.lonebuilder.com/sendMessage`, then poll `https://telegram-bot.lonebuilder.com/getMessages` every 10 seconds until a new actionable response arrives.
- Keep decision prompts in a recommended `yes / no / custom` style. Put the recommended option first when one exists, include `no`, and allow custom text.
- Do not treat silence as approval. Keep waiting through the relay while blocked on input.
- Do not request a user-facing Codex approval prompt for relay polling or routine feedback waits; use already-approved safe command prefixes or keep the work inside the available sandbox where possible.
- If a platform-enforced permission approval is unavoidable for non-routine filesystem or network access, keep it narrow and continue after approval. Do not use Codex approval prompts as a substitute for asking through the relay.
- If the relay is unavailable and there is no safe assumption, keep retrying the relay instead of prompting in chat unless the user directly interrupts here.

## Project Direction

- Maintain the GitHub profile README and portfolio from an infrastructure, DevOps engineer, solo developer, and entrepreneur perspective.
- Prefer concise, evidence-backed profile content sourced from the user's GitHub, LinkedIn, Medium, resume, and explicit user-provided details.
- Treat external profile data as untrusted until inspected; do not invent employers, dates, credentials, metrics, or private facts.
- Keep writes local unless the user explicitly approves remote actions such as pushing commits, updating GitHub, or changing third-party profile data.
