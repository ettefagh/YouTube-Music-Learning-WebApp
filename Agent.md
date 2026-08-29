# AI Agent Operating Contract — v5

> Canonical source of truth for all AI agent behavioral rules in this repository.
> GitHub Issues is the **single durable task surface**. This file is the operating contract that governs how agents interact with that surface and the codebase.
>
> For project-specific architecture, stack identity, and domain documentation maps, see the project's `agent_directives.md` or equivalent.

---

## 0. Design Principles

This contract is built on five engineering axioms:

1. **GitHub Issues are the ledger.** One issue = one durable task thread. The issue body is the raw prompt, the engineered reply is the implementation contract, the commit records the code change, and the completion reply is the archive. No local task files.
2. **Constrain the agent, don't empower it.** Every section exists to bound scope, prevent drift, and keep output deterministic and auditable.
3. **Separate engineering from execution.** Planning, implementation, and independent review are distinct stages governed by Coordinator dispatch locks and exact-head reviews.
4. **Context is a budget.** Gather only the context needed for the task. Graphify first, targeted reads second, raw file reads last.
5. **Documentation is code.** If the implementation changes behavior, the docs must change in the same commit or be explicitly deferred.

---

## 1. Source of Truth

| Surface | Role | Agent responsibility |
|---|---|---|
| **GitHub Issues** | Primary task queue: raw intake → engineered prompt → implementation → completion archive | Read, label, engineer, implement, commit, report — everything lives in the issue thread |
| **This contract** (`ai_agent_contract.md`) | Workflow and behavioral rules | Re-read before engineering or implementing any issue |
| **Project documentation** (`docs/` or `Development/` system docs) | Architecture, UX, QA, build, schema, and domain contracts | Read before engineering; update when the implementation changes the matching behavior |
| **Knowledge graph** (`graphify-out/`) | Codebase topology and cross-cutting context | Query before engineering any non-trivial issue |

> [!IMPORTANT]
> **No local task ledger files & Single-Thread Integrity.** Do not create or maintain `Task0_Raw.md`, `Task1_Engineered.md`, `Task2_Archived.md`, or similar local files for new work. Furthermore, every task must execute all three of its lifecycle phases (raw intake body → engineered prompt comment → completion report comment) within the **exact same GitHub issue thread**. Never create a new GitHub issue solely to post a completion note or close a task.

---

## 2. Issue Lifecycle Labels

Every issue handled by an AI agent must carry exactly **one** lifecycle label at all times:

| Label | Meaning | Transition trigger |
|---|---|---|
| `raw` | Unengineered user request | Issue created or identified as unengineered |
| `engineered` | Scoped, bounded, and ready to implement | Engineered reply posted, `raw` removed |
| `proceeded` | Implemented, committed, verified, and reported; open for independent review | Coordinator applies it after the completion reply is posted with a full commit SHA |

**Strict label rules:**

- Never leave multiple lifecycle labels on the same issue.
- Do not apply `engineered` without posting the engineered reply first.
- Do not apply `proceeded` without a completion reply that includes the full commit SHA.
- If an issue has no lifecycle label, inspect it and apply `raw` if unengineered.
- An open `proceeded` issue is awaiting independent Engineer review and must not be closed by the Proceeder.
- Only the Coordinator may mutate lifecycle labels, acquire or release a dispatch lock, or close an issue.
- The Coordinator may close a `proceeded` issue only after the original thread contains an exact `Review decision: Resolved` comment.
- A `Review decision: Fix needed` keeps the issue open, preserves the historical thread, and returns it to `engineered` only after versioned re-engineering is posted in that same thread.

### Label Bootstrap

If the project has not yet created these labels:

```bash
gh label create raw         --color BFDADC --description "Unengineered user request"
gh label create engineered  --color FBCA04 --description "Scoped and ready to implement"
gh label create proceeded   --color 0E8A16 --description "Implemented, committed, and verified"
```

### Coordinator ownership and dispatch lock

The Coordinator is the ledger authority. Engineer and Proceeder agents may
post scoped comments and evidence, but they must not apply or remove lifecycle
labels, close issues, acquire or release dispatch locks, or approve their own
work. A lock is Coordinator state identifying the issue, assigned role,
thread, repository state, and timestamp; it is released only after the
Coordinator has re-read the issue and repository evidence. There is at most
one repository-mutating Proceeder lock at a time.

Before every dispatch the Coordinator fetches the complete open issue set,
repairs missing or duplicate lifecycle labels, checks dependency readiness,
and verifies that the selected issue still has the expected label and thread.
Filtered label queries are not a substitute for this audit. A dirty worktree,
overlapping issue-owned files, missing credentials, or ambiguous state blocks
mutation and releases no second lock.

Dispatch priority is: open `proceeded` awaiting review, `engineered` awaiting
implementation, then oldest `raw` awaiting engineering. In authorized continuous
program execution, the Coordinator autonomously dispatches the Proceeder upon
posting a valid engineered contract, retaining the mandatory independent review
gate and fail-closed stop on unsafe, ambiguous, or out-of-scope state. The
Coordinator may dispatch but cannot engineer its own assignment, implement it,
or approve its own work.

### Bounded role prompts

Use these role boundaries when starting a fresh context:

**Coordinator prompt**

> You are the Coordinator. Re-read this contract and the issue thread. Audit
> the complete open issue set, select one dependency-ready issue, and dispatch
> the correct specialist. You alone may mutate lifecycle labels, manage the
> dispatch lock, and close issues. Validate returned comments and evidence,
> then re-read the issue, labels, state, commit SHA, and repository status.
> Stop on unsafe, ambiguous, or out-of-scope state.

**Engineer prompt**

> You are the Engineer. In engineering mode, convert the raw request into one
> bounded, testable contract and state that implementation has not begun. In
> review mode, use a fresh context and begin with exactly `Review decision:
> Resolved` or `Review decision: Fix needed`. Assess scope, correctness,
> verification, docs, accessibility, privacy, security, performance,
> migration, and visible behavior. Do not implement, relabel, or close.

**Proceeder prompt**

> You are the Proceeder. Implement only the latest `engineered` scope,
> preserve unrelated work, verify the touched surface, and return a completion
> packet with issue-owned files and full commit SHA. Do not apply `proceeded`,
> close the issue, broaden scope, or decide that your own work is resolved.

---

## 3. Tooling Contract

Agents must use the right tool for the right job. Default tool selection:

| Tool | Purpose |
|---|---|
| `gh` | Issue CRUD, labels, comments, closing |
| `/graphify` or `mcp_graphify_*` | Codebase topology queries — **always first** for cross-cutting tasks |
| `rg` (ripgrep) | Fast code/doc pattern search |
| `git` | Status, diff, commit, SHA capture |
| Project CLI (`npm`, `wrangler`, etc.) | Build, test, analyze, deploy |
| `/svelte-code-writer` | Svelte 5 documentation lookup, code analysis, and autofixing — **must run** when creating or editing `.svelte`, `.svelte.ts`, or `.svelte.js` files |
| `/svelte-core-bestpractices` | Svelte 5 reactivity (runes), event handling, styling, snippets, and library integration guidance — **load** whenever writing or reviewing Svelte components |
| `/cloudflare` | Cloudflare platform skill covering Workers, Pages, KV, D1, R2, AI, networking, security, and IaC — **load** for any Cloudflare development or deployment task |

### 3.1 Context Gathering Hierarchy

Follow this order to minimize token usage and maximize relevance:

1. **Knowledge graph** → `/graphify query "<question>" --budget 1500`
2. **Targeted search** → `rg "<pattern>" --type <lang>` for specific symbols
3. **Domain docs** → Read the relevant `docs/` or `Development/*.md` files cited by Graphify
4. **Raw file reads** → Only when the above are insufficient

### 3.2 Graphify Requirement

Use Graphify before writing an engineered prompt when the issue touches more than one file, system, or domain:

```bash
# Broad context for engineering
/graphify query "How does <issue topic> connect to existing components, routes, stores, and docs?" --budget 1500
/graphify query "What scalability risks or preservation rules apply to <issue topic>?" --budget 1500

# Narrow trace for specific flows (DFS mode)
/graphify query "How does <state A> reach <state B>?" --dfs --budget 1500
```

- Treat Graphify output as **context, not authority**. Confirm important facts by reading the cited files.
- Graphify may be skipped only for trivial, single-file, obvious changes. If skipped, state why in the engineered reply.
- If Graphify is unavailable, continue with `rg` and direct file reads, and note the gap.

### 3.3 Default Command Patterns

```bash
# Issue management
gh issue list --state open --label raw --json number,title,createdAt,labels,url
gh issue view <number> --json number,title,body,comments,labels,url
gh issue comment <number> --body-file <file>
gh issue edit <number> --remove-label raw --add-label engineered
gh issue edit <number> --remove-label engineered --add-label proceeded
gh issue close <number>

# Repo state
git status --short
git diff --check
git rev-parse HEAD
```

### 3.4 Svelte Tooling Requirement

CampusWeb is a SvelteKit project using **Svelte 5**. Agents must use two complementary Svelte skills whenever touching Svelte code:

**Before writing or editing Svelte code:**

1. **Load `/svelte-core-bestpractices`** to internalize Svelte 5 patterns:
   - `$state` for reactive variables (use `$state.raw()` for large re-assigned objects/arrays)
   - `$derived` / `$derived.by()` for computed state — **never** use `$effect` to sync derived values
   - `$effect` is an escape hatch — prefer event handlers (`onclick`, `oninput`) and `{@attach}` for DOM libs
   - `$props()` for component props — derive computed values with `$derived`, not static initializers
   - Native event syntax (`onclick={fn}`) instead of legacy `on:click`
   - `{#snippet}` / `{@render}` instead of legacy slots
2. **Query the Svelte MCP server** for relevant docs when unsure about syntax or API:
   - MCP tool `list-sections` → discover available documentation sections
   - MCP tool `get-documentation` → fetch full docs for specific sections (e.g., `"$state,$derived,$effect"`)
   - CLI fallback: `npx @sveltejs/mcp list-sections` / `npx @sveltejs/mcp get-documentation "<sections>"`

**After writing or editing Svelte code:**

3. **Run `svelte-autofixer`** on every changed `.svelte`, `.svelte.ts`, or `.svelte.js` file:
   - MCP tool: `svelte-autofixer`
   - CLI: `npx @sveltejs/mcp svelte-autofixer "./path/to/Component.svelte"`
   - **Terminal escaping:** When passing inline code with runes via CLI, escape `$` as `\$` (e.g., `\$state`, `\$derived`)
4. **Keep running the autofixer until it returns zero issues.** Do not consider Svelte code complete while issues remain.

**Skip conditions:** Svelte skills may be skipped only for changes that do not touch any SvelteKit file — neither frontend (`.svelte`, `.svelte.ts`, `.svelte.js`) nor backend (`+server.ts`, `+page.server.ts`, `+layout.server.ts`, `hooks.server.ts`). Examples of skippable changes: standalone Cloudflare Worker scripts, docs-only edits, or config-only changes. If skipped, concisely state why.

### 3.5 Cloudflare Tooling Requirement

CampusWeb deploys on Cloudflare (Pages, Workers, KV, D1, R2). Agents must load `/cloudflare` when the issue touches any Cloudflare infrastructure.

**Retrieval-first principle:** Agent knowledge of Cloudflare APIs, limits, and pricing may be stale. Always retrieve current information before citing specifics:

| Source | How to retrieve |
|---|---|
| Cloudflare docs | `cloudflare-docs` MCP search tool or `https://developers.cloudflare.com/` |
| Workers types | Check `node_modules/@cloudflare/workers-types` |
| Wrangler config schema | `node_modules/wrangler/config-schema.json` |
| Product changelogs | `https://developers.cloudflare.com/changelog/` |

When a reference file and the docs disagree, **trust the docs**.

**Use the Cloudflare skill's decision trees** to pick the right product before engineering:

- "I need to run code" → Workers, Pages, Durable Objects, Workflows, etc.
- "I need to store data" → KV, D1, R2, Queues, Vectorize, etc.
- "I need security" → WAF, DDoS, Turnstile, API Shield, etc.

**Skip conditions:** Cloudflare skills may be skipped for changes that do not touch backend infrastructure, deployment config, or storage bindings. If skipped, state why.

---

## 4. Engineering an Issue

> [!IMPORTANT]
> **Engineering and implementation are separate steps.** Do not implement in the same response unless the user explicitly says "engineer and proceed."

### 4.1 Issue Selection & Intake

1. Retrieve open issues: `gh issue list --state open --label raw`.
2. Prefer the **oldest** open `raw` issue for engineering.
3. Handle **one issue at a time** unless the user asks for batch work.
4. If an issue has no lifecycle label, inspect and apply `raw` if unengineered.
5. **Chat Intake / New Work:** If a user request originates in chat and does not yet exist as a GitHub issue, **you must create the issue first** (`gh issue create --label raw --title "<Subject>" --body "<Raw User Prompt>"`) before doing any engineering or implementation. This guarantees all three phases live in one continuous thread.

### 4.2 Pre-Engineering Checklist

Before writing the engineered prompt, complete every applicable step:

- [ ] Re-read this contract
- [ ] Read the issue body and any existing comments
- [ ] Run `/graphify query` for the issue topic (skip only for trivial single-file changes)
- [ ] Confirm Graphify findings by opening cited files
- [ ] Read the relevant domain documentation
- [ ] Search the codebase with `rg` for related code surfaces
- [ ] Identify scalability-preservation constraints
- [ ] Determine if triage questions are needed before scoping

### 4.3 Triage Gate

Before expanding a raw issue into an engineered prompt, evaluate:

| Question | Purpose |
|---|---|
| **Should this task exist?** | Filter noise and duplicates |
| **What is the smallest safe scope?** | Prevent scope creep |
| **What should be explicitly skipped?** | Make deferred work visible |
| **What are the non-negotiable boundaries?** | Architecture, security, and product constraints |

If the raw issue is ambiguous or incomplete after triage, write the required clarification questions as an issue comment and **stop**. Do not engineer an ambiguous task.

Record triage outcomes in the engineered reply.

### 4.4 Engineered Reply Shape

Post the engineered prompt as a GitHub issue comment using this exact structure:

```markdown
Engineered task per `ai_agent_contract.md`.

**Title:** <Specific, descriptive implementation title — never single-word>

**Raw source:** <Short quote or summary of the issue body>

**Issue:** <Concrete problem statement>

**Triage:**
- Should exist: <Yes/No + rationale>
- Smallest safe scope: <Bounded scope description>
- Skipped scope: <Explicitly deferred work>
- Boundaries: <Architecture/security/product constraints>

**Action:** <What to implement, step by step>

**Project perspective:** <Why this matters in this project's architecture and user model>

**Implementation scope:**
- <Likely component/module/file>
- <Likely component/module/file>
- <Test surfaces>

**Scalability considerations:** <Concrete scaling risk, preservation rule, or "Scalability impact: none expected.">

**Future split guidance:** <Deferred follow-up work. If concrete and actionable, append as new `raw` issues.>

**Edge cases:**
- <Edge case and how to handle it>

**Acceptance criteria:**
- [ ] <Checkable, testable outcome>
- [ ] <Checkable, testable outcome>

**Dependencies:** `<docs/relevant_doc.md>`, `<docs/other_doc.md>`
```

### 4.5 Post-Engineering Actions

1. Post the engineered reply before any label transition.
2. The Coordinator updates labels: remove `raw`, add `engineered`.
3. **Dispatch:** In authorized autonomous mode, the Coordinator immediately acquires the dispatch lock and dispatches the Proceeder upon posting the engineered reply. In manual gate mode, pause for user approval.
4. Keep the engineered title stable — it becomes the commit subject.

---

## 5. Implementing an Engineered Issue (Proceeding)

### 5.1 Issue Selection for Implementation

1. Retrieve open issues: `gh issue list --state open --label engineered`.
2. Prefer the **oldest** `engineered` issue.
3. Handle one at a time unless the user asks otherwise.

### 5.2 Pre-Implementation Checklist

Before writing code:

- [ ] Re-read the engineered reply (it may have been updated since engineering)
- [ ] Re-read all dependency docs named in the engineered reply
- [ ] Inspect current code — the repo may have changed since engineering
- [ ] Run `git status --short` to check for unrelated uncommitted changes
- [ ] Do not mix unrelated user changes into the task commit

### 5.3 Implementation Rules

During coding:

- **Stay inside the engineered scope.** Do not implement skipped scope.
- **Update domain docs** when behavior, architecture, UX, QA, build, localization, schema, or API contracts change.
- **Add focused tests** when behavior changes.
- **Run verification commands** — start narrow, broaden only when risk requires it.
- If the implementation reveals a significant scope gap, **stop and update the engineered reply** for re-approval instead of silently expanding.

### 5.4 Commit Rules

After verification passes:

```bash
git add <issue-related files only>
git commit -m "<Engineered Prompt Title>"
git rev-parse HEAD
```

**Strict commit requirements:**

- Commit subject = the engineered prompt title.
- Commit only files belonging to this issue.
- Do not commit unrelated changes.
- If unrelated changes are mixed into the same files and cannot be separated safely, **stop and ask the user.**
- Capture the full commit SHA.

---

## 6. Completion Reply

Post the completion report as a GitHub issue comment. **This is the archive.** Use this exact shape:

```markdown
Implemented the engineered scope for this issue.

**Commit:** `<full commit SHA>`

**Files touched:**
- `<file>`
- `<file>`

**Behavior verified:** <What changed in product/code behavior>

**Verification passed:**
- `<command and result>`
- `<command and result>`

**Docs updated:**
- `<doc>` — <what changed or "reviewed, no change needed">

**Deferred:** <Skipped scope that remains intentionally unimplemented, or "None">
```

### 6.1 Post-Completion Actions

1. Post the completion reply as a comment on the **original** issue thread that contains the raw intake and engineered prompt: `gh issue comment <number> --body-file <report.md>`. Never create a new issue for the completion note.
2. The Coordinator verifies the full SHA and evidence, then removes `engineered` and adds `proceeded`.
3. Leave the issue open for a fresh Engineer review context.
4. After `Review decision: Resolved`, the Coordinator closes the issue and confirms final state: `gh issue view <number> --json labels,state,url`.
5. After `Review decision: Fix needed`, the Coordinator keeps the issue open, appends the review and `Engineered task vN` comment in the same thread, removes `proceeded`, adds `engineered`, and stops at the renewed human gate.

**Strict completion rules:**
- Do not apply `proceeded` until the completion reply includes the full commit SHA.
- Do not close an issue without an exact `Review decision: Resolved` review comment.
- Do not create a new GitHub issue just to post a completion reply or report. All three phases must reside in the single original issue thread.

### 6.2 Independent review templates

The Engineer must post one of these exact decision headers in a fresh review
context. Historical engineering and completion comments remain unchanged.

**Resolved**

```markdown
Review decision: Resolved

**Engineered version reviewed:** <version/comment link>
**Commits reviewed:** <full SHA list>

**Acceptance evidence:**
- <criterion and evidence>

**Verification independently repeated:**
- `<command or browser check>` — <result>

**Docs:** <updated or reviewed>
**Residual risk:** <none or bounded risk>
```

**Fix needed**

```markdown
Review decision: Fix needed

**Engineered version reviewed:** <version/comment link>
**Commits reviewed:** <full SHA list>

**Findings:**
1. **Severity:** <blocking/high/medium>
   **Evidence:** <file, line, test, browser, or artifact evidence>
   **Acceptance criterion affected:** <criterion>
   **Required correction:** <smallest bounded correction>

**Still accepted:**
- <completed behavior that must be preserved>

**Re-engineering boundary:** <same issue scope or reason to split a new raw issue>
```

The Coordinator must not close on a prose statement that lacks the exact
`Review decision: Resolved` header. A Fix needed review is versioned in the
same issue thread as `Engineered task vN`, returns the lifecycle label to
`engineered`, and is re-dispatched for bounded correction.

---

## 7. Scalability Considerations

Every engineered task must either name **concrete scaling assumptions or risks**, or explicitly state: *"Scalability impact: none expected."*

### Topics to Cover (When Relevant)

| Category | Examples |
|---|---|
| **Data volume** | Query fan-out, N+1 loops, pagination, batch limits |
| **Storage** | KV/D1/R2 limits, localStorage quota, cache invalidation, database growth |
| **Runtime cost** | Provider rebuilds, re-renders, sync queue pressure, API rate limits |
| **Deployment** | Payload size, cold start, build time, CDN invalidation |
| **Growth domains** | Multi-tenant, multi-language, notification fan-out, media uploads, offline cache, telemetry aggregation |

### Scope Splitting for Scale

If a professional long-term approach would expand the immediate task beyond its bounded scope:

1. Keep the current task **small and bounded**.
2. Name the larger solution in `Future split guidance`.
3. If the deferred work is concrete and actionable, **create new `raw` GitHub issues** instead of hiding future work inside a large engineered task.

Pattern: *Fix the symptom now → file the systemic issue separately.*

---

## 8. Documentation Alignment

Documentation updates happen as part of implementation. GitHub replaces the task ledger, not the system docs.

### 8.1 When to Update Docs

Update the relevant documentation when the implementation changes:

- UX behavior or user-facing flows
- Data schema, API contracts, or storage rules
- Authentication or session behavior
- Offline/sync/local-first behavior
- Build, deploy, or CI/CD behavior
- Error handling or logging behavior
- QA expectations or test infrastructure
- Accessibility or privacy implications

### 8.2 Documentation in the Completion Reply

The completion reply **must explicitly state** which dependency docs were updated or reviewed. "Updated" means changed in the same commit. "Reviewed" means inspected and confirmed no change was needed.

### 8.3 Large Documentation Scope

If the combined scope of implementation + docs is too large for a single attempt, split them:
1. Implement and commit the code change.
2. File a new `raw` issue for the documentation update with a reference to the implementation commit.

---

## 9. Anomaly Handling

| Situation | Action |
|---|---|
| **Ambiguous raw issue** | Post clarification questions as an issue comment. Do not engineer until resolved. |
| **Scope creep during implementation** | Stop. Update the engineered reply with the expanded scope. Wait for user approval. |
| **Unrelated uncommitted changes** | Do not mix into the task commit. Ask the user how to proceed. |
| **GitHub unavailable** | Note the gap. Continue with local notes. Reconcile into GitHub when access returns. |
| **Significant time gap** | Re-read the issue and repo state before continuing. Another agent or user may have made changes. |
| **Failed verification** | Do not commit. Fix the issue or update the engineered reply. Do not mark as `proceeded`. |
| **Implementation reveals a bug in existing code** | Fix only if it's within the engineered scope. Otherwise, file a new `raw` issue. |

---

## 10. Professionalism Standard

The GitHub issue thread must be **readable by a human reviewer without opening the IDE.**

### Minimum Quality Bar

- [ ] Issue has a clear, descriptive title
- [ ] Lifecycle label is correct and singular
- [ ] Engineered reply is bounded, testable, and parseable
- [ ] Commit subject matches the engineered title
- [ ] Completion reply includes the full commit SHA
- [ ] Verification commands are named exactly with results
- [ ] Dependency docs are updated or explicitly reviewed
- [ ] Deferred scope is named, not silently ignored
- [ ] No `[Placeholder...]` strings remain in any reply

### Auditability

Every agent decision must be **traceable**:

- Why was scope bounded this way? → Triage section
- What was skipped and why? → Skipped scope + Future split guidance
- What was tested? → Verification section
- What docs were affected? → Docs section in completion reply
- What is the exact code change? → Commit SHA

---

## 11. Contract Versioning

This contract is versioned. When updating:

1. Increment the version in the title.
2. Summarize what changed at the bottom of this file.
3. Commit the contract update as its own change, not bundled with a task.

### Changelog

| Version | Date | Summary |
|---|---|---|
| v3 | 2025-07-25 | Unified contract from campusweb (file-based) and hable (GitHub-based) patterns. Removed local task ledger, Ponytail dependency, and project-specific tooling. Added design principles, triage gate, anomaly table, context hierarchy, and contract versioning. Aligned with 2026 agent governance best practices. |
| v4 | 2026-08-03 | Added Coordinator-only lifecycle authority and dispatch locks, kept open `proceeded` issues in independent review, defined Resolved/Fix needed return paths and bounded role prompts, and required deterministic lifecycle audit coverage. |
| v5 | 2026-08-20 | Streamlined human approval gate for autonomous multi-agent program coordination, maintaining strict separation of Coordinator/Engineer/Proceeder roles, immutable issue-thread ledger, exact-head reviews, and fail-closed stop conditions. |
