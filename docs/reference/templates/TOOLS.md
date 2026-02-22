---
title: "TOOLS.md Template"
summary: "Workspace template for TOOLS.md"
read_when:
  - Bootstrapping a workspace manually
---

# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for local specifics that are unique to your setup.

## Safety Rule

Never store secrets in this file.

- No passwords, tokens, private keys, OTP seeds, or session cookies.
- Store references only (for example: "1Password item: Npmjs").

## What Goes Here

Use this file for environment-specific notes such as:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker and room names
- Device nicknames
- Any other setup-specific mapping

## Entry Format

Use a simple, consistent record for each item:

```markdown
### <Category>

- Name: <short id>
- Purpose: <what it is used for>
- Location: <host/path/room/app>
- Last verified: YYYY-MM-DD
- Notes: <optional>
```

## Minimal Example

```markdown
### Cameras

- Name: living-room
- Purpose: Main area overview
- Location: Main floor
- Last verified: 2026-02-21
- Notes: 180 degree wide angle
```

## Bad Example

```markdown
### SSH

- host: prod-gateway
- token: ghp_xxxxxxxxxxxxxxxxxxxx
```

Why this is bad: it stores a secret and uses inconsistent structure.

## Stale Data Hygiene

- Add `Last verified` for every entry.
- Re-check and prune entries older than 90 days.
- Remove notes that no longer map to real devices or hosts.

## Why Separate

Skills are shared. Your setup is not. Keeping them apart lets you update skills without losing local notes and share skills without leaking infrastructure details.

---

Add whatever helps you do your job. This is your cheat sheet.
