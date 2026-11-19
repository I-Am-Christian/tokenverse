# Warp Coin — Dedicated Supabase Setup

**Status:** Awaiting a separate Warp Coin Supabase project and an explicit choice of organization. Do **not** reuse the existing **Hello Earth DB** tutoring/business project. This file is a deployment plan, not a claim that accounts, chat or synchronized saves are live.

## Connect your game database

1. Visit https://supabase.com/dashboard/projects and create a **new** project named **Warp Coin** in the organization you want to bill. Review the displayed project cost and select an appropriate region. Keep the generated database password private.
2. Make sure the Supabase app/connector in ChatGPT is connected to the same account. Once the new project appears in the available-project list, its ref can be used to set up a migration and security policies.
3. Use that project's **URL** and **publishable key** in the static GitHub Pages frontend. Never embed a `service_role` key, secret API key or database password in website code, public Git commits or chat.
4. Configure Supabase Auth with email verification, permitted URLs, and HTTPS redirects for your actual public origin. GitHub Pages is currently https://i-am-christian.github.io/tokenverse/ — avoid changing the public path before verifying a new domain.
5. Test with multiple real accounts and review RLS policies, authentication rules, storage, moderation, rate limits and database logs before enabling shared access.

## Proposed data structure

| Table / service | Function | Access rule |
| --- | --- | --- |
| Auth users | Email/password or magic-link sign-in | Supabase Auth; no client-managed passwords |
| pilot_profiles | Display name, avatar, faction membership | Public safe fields; only the account holder can change writable fields |
| pilot_saves | Versioned ship and colony snapshots | Read/write only by account owner; validated input |
| friend_requests and friendships | Invitations, accepted relationships and blocks | Participants only; explicit state transitions |
| chat_channels and chat_messages | Global, faction and private messages | Verified identity and server-checked membership; rate limits, reporting |
| faction_memberships | Actual faction association | Server-controlled; do not authorize via editable user metadata |
| economy_ledger | Bounded, auditable simulation balance changes | Server-authoritative transactions; never direct arbitrary client writes |
| player_coins | Fictional market metadata and current supplies | Server-only issuance, limits and audited settlement |

All exposed player tables need **Row Level Security**. In particular, faction chat cannot rely on a user-editable faction field in an access token, and direct messages must be restricted to their participants. Chat also needs moderation, spam controls and abuse reporting.

## Technical boundaries

The current GitHub Pages game is static and saves locally under `tokenverse-deep-space-v10`. Supabase can handle identity, persistence and chat, but game economy decisions and competitive combat will also require server-authoritative validation (for example trusted Edge Functions or a game server). Real-money purchases, investing, investment returns, NFTs and wallet withdrawals are out of scope until security, legal, age and financial compliance are deliberately designed and reviewed.

**Nothing in this document changes the separate Hello Earth DB.** Creating a new project may affect Supabase billing; check cost before provisioning.
