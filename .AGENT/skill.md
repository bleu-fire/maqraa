# MAQRA — AI Copilot Instructions

> Read this file at the start of every session. It defines what you are allowed to do and how to work on this project.

---

## What is Maqra?

A **100% local** React Native Expo app (no external APIs) for Moroccan readers to:
- Catalogue books (Arabic / French / Amazigh/Tamazight)
- Track reading progress and sessions
- Set yearly reading goals
- View cumulative stats and streaks

**Design language:** Moroccan zellige-inspired — Majorelle Blue (`#6050DC`), Terracotta (`#C0714F`), Mint Green (`#3EB489`), on deep dark backgrounds. JetBrains Mono for data, a warm serif/sans for content.

---

## Project Structure — Enforce This Always

```
/app                  → Expo Router screens (NavigationLayout only)
/components           → Pure UI components. Props in, JSX out. ZERO logic.
/store                → Zustand stores (manually written by student)
/lib                  → Pure utility functions (manually written by student)
/hooks                → Custom hooks (manually written by student)
/assets               → Images, fonts
```

**Hard rule:** Never suggest adding business logic inside `/components`. If you catch it there, flag it immediately and tell the student which file it should live in instead.

---

## The Vibe Coding Contract — Critical

This project has a strict workflow split:

| Layer | Who writes it | Your role |
|---|---|---|
| **UI / JSX / styles** | Google Stitch generates it | Help integrate + adapt |
| **Logic (store, hooks, lib)** | Student writes manually | Guide only — explain concepts, never paste full logic blocks |

### What you MUST NOT do
- Never write a full Zustand store and say "copy this"
- Never write a complete hook implementation for the student
- Never write calculation logic (`progressPercent`, `readingStreak`, etc.) and hand it over as-is
- Never write AsyncStorage persistence logic for the student

### What you SHOULD do
- Explain how something works: *"A streak counter checks if today's date and yesterday's date both have sessions — here's the concept…"*
- Show minimal illustrative snippets (3–5 lines) that demonstrate a pattern, not a solution
- Ask the student to implement it, then review their attempt
- Point to the right file: *"This belongs in `/lib/stats.ts`, not in the screen component"*

### How to guide (not do)
When a student asks *"How do I calculate streak?"*:
1. Explain the algorithm in plain English
2. Show the data shape they need to work with
3. Ask them to write it
4. Review their code and explain what to fix

---

## Screens Reference

### Screen 1 — Library (Dashboard)
- `FlatList` of books: cover photo, title, author, language badge (ar/fr/tz), status badge
- Animated progress ring: books read / yearly goal
- Quick stats bar: total books, pages read, finished this month
- Filter bar: by status + by language; search by title/author
- FAB to add new book (manual form + camera for cover)

### Screen 2 — Book Detail & Reading Session
- Cover, title, author, pages, language, status, star rating (1–5)
- Animated progress ring/bar: current page / total pages
- Input to update current page → recalculate + animate
- Stopwatch: Start / Pause / Stop with haptic feedback (`expo-haptics`)
- Animated counters: pages read increment, time elapsed
- Status buttons: mark "In Progress" / "Finished"

### Screen 3 — Stats & Profile
- Profile photo via `expo-camera` or `expo-image-picker` — stored locally
- Cumulative stats: total books, total pages, total reading time, current streak (days)
- Reading history `FlatList` with entrance animations
- Books-finished-per-month bar chart — **custom SVG bars, no chart library**
- Delete book / delete session actions

---

## Data Models

```typescript
// /store/types.ts — student must write these

type Language = 'ar' | 'fr' | 'tz'
type Status = 'to-read' | 'in-progress' | 'finished'

interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  currentPage: number
  language: Language
  status: Status
  coverUri?: string
  rating?: number          // 1–5
  addedAt: number          // timestamp
  finishedAt?: number
}

interface ReadingSession {
  id: string
  bookId: string
  startedAt: number        // timestamp
  durationSeconds: number
  pagesRead: number
}

interface UserProfile {
  name: string
  avatarUri?: string
  yearlyGoal: number       // default 12
}
```

**Persist all of the above with AsyncStorage.** Key schema: `maqra:books`, `maqra:sessions`, `maqra:profile`.

---

## Zustand Store Shape (guide only — student writes the implementation)

Three stores minimum:
- `useBookStore` — CRUD for books + filter/search state
- `useSessionStore` — session CRUD + active timer state
- `useProfileStore` — profile + yearlyGoal

Each store must have a `hydrate()` action that loads from AsyncStorage on app start.

---

## Logic the Student Must Write (never write for them)

| Feature | File | What to guide |
|---|---|---|
| Progress % | `/lib/progress.ts` | `currentPage / totalPages * 100` |
| Reading streak | `/lib/stats.ts` | Compare sorted session dates, count consecutive days |
| Books per month | `/lib/stats.ts` | Group `finishedAt` by month |
| Total pages read | `/lib/stats.ts` | Sum `pagesRead` across all sessions |
| Stopwatch | `/hooks/useStopwatch.ts` | `setInterval`, cleanup on unmount, pause logic |
| Yearly goal % | `/lib/progress.ts` | `finishedBooks.length / yearlyGoal * 100` |

---

## Animations — Reanimated 2

Minimum 4 animations required, all at 60 fps:
1. Progress ring fill (library dashboard + book detail)
2. Stopwatch counter digits (smooth increment)
3. Session history list items (entrance animation on mount)
4. Monthly bar chart bars (animate height on screen focus)

Always use `useSharedValue`, `withTiming` or `withSpring`. Never `Animated` from React Native core.

---

## RTL / Multilingual

- Use `I18nManager.isRTL` to detect RTL context
- For Arabic books, the book card layout must mirror (title right-aligned, chevron left)
- Use `writingDirection: 'rtl'` on text inside Arabic book cards
- Language badge colors: `ar` → Terracotta, `fr` → Majorelle Blue, `tz` → Mint Green

---

## Camera / Image Picker

For profile photo (Screen 3):
```
expo-image-picker — use launchCameraAsync + launchImageLibraryAsync
```
- Always request permissions before opening camera
- Handle `status !== 'granted'` gracefully — show an explanatory alert
- Save `uri` to profile store → persist with AsyncStorage
- Cover photos (Screen 1 add book): same approach

---

## Design Tokens — Always Use These

```css
/* Backgrounds */
--bg-base: #0D0D0D
--bg-surface: #161616
--bg-elevated: #1F1F1F

/* Brand */
--majorelle: #6050DC
--terracotta: #C0714F
--mint: #3EB489
--gold: #D4A843

/* Text */
--text-primary: #F2F2F2
--text-secondary: #A0A0A0
--text-muted: #555555

/* Semantic */
--success: #3EB489
--warning: #D4A843
--destructive: #C0714F
```

Typography: `JetBrains Mono` for numbers/data, `Inter` or `DM Sans` for body/labels.

---

## Jira Ticket Structure

When asked to help structure Jira tickets, use this Epic breakdown:

| Epic | Key tickets |
|---|---|
| **Setup** | Expo init, folder structure, nav, design tokens |
| **Library Screen** | Book list UI, filter bar, progress ring, FAB |
| **Add Book** | Form UI, camera integration, store action |
| **Book Detail** | Detail UI, page input, progress animation |
| **Session Timer** | Stopwatch hook, haptics, session save |
| **Stats Screen** | Profile photo, cumulative stats, bar chart |
| **Persistence** | AsyncStorage hydration for all stores |
| **RTL Support** | Arabic layout mirroring, writingDirection |
| **Polish** | Animations audit, empty states, error states |

Each ticket must have:
- Title in imperative form: *"Implement reading streak calculation"*
- Acceptance criteria (2–4 bullet points)
- Linked to the correct Epic

---

## What to Check in Every Code Review

1. **No logic in `/components`** — if you see `useState` for business data or calculations in a component file, flag it
2. **Store actions return void** — side effects (AsyncStorage writes) happen inside the action
3. **`useEffect` cleanups** — stopwatch `setInterval` must be cleared on unmount
4. **Permissions handled** — camera/image-picker must check permission status before calling
5. **RTL tested** — add a dummy Arabic book and verify card layout mirrors correctly
6. **AsyncStorage error handling** — all `getItem`/`setItem` calls must be in `try/catch`

---

## Session Kickoff Checklist

At the start of each work session, ask the student:
1. Which screen or feature are you working on today?
2. Is this a UI task (Stitch integration) or a logic task (store/hook/lib)?
3. What's the current Jira ticket?

Then scope your help to that ticket only. Don't wander into other features.

---

## Constraints Reminder

- **No external APIs.** Everything is local. Don't suggest fetching book data from Open Library, Google Books, etc.
- **No heavy chart libraries** (Victory, Recharts). The monthly bar chart is custom SVG.
- **Expo managed workflow only.** No bare workflow, no native modules beyond the Expo SDK.
- **TypeScript throughout.** Every file is `.ts` or `.tsx`. No `any` types.

---

## Jira Management — via MCP

Jira is the source of truth for all work. Use the Jira MCP server to create, update, and move tickets. Never track work in comments or chat — it lives in Jira.

### Board Setup

```
Project key: MAQRA
Board type:  Scrum (single sprint = 5 days)
Columns:     Backlog → To Do → In Progress → In Review → Done
```

### Epic List — Create These First

| Epic Name | Description |
|---|---|
| `SETUP` | Expo init, folder structure, navigation skeleton, design tokens |
| `LIBRARY-SCREEN` | Book list FlatList, filter bar, progress ring, FAB |
| `ADD-BOOK` | Add book form, camera cover photo, store action |
| `BOOK-DETAIL` | Detail screen UI, page input, progress animation |
| `SESSION-TIMER` | Stopwatch hook, haptics, session persistence |
| `STATS-SCREEN` | Profile photo, cumulative stats, monthly bar chart |
| `PERSISTENCE` | AsyncStorage hydration for all three stores |
| `RTL-SUPPORT` | Arabic layout mirroring, writingDirection |
| `POLISH` | Animations audit, empty states, error states, README |

### Ticket Format (enforce strictly)

Every ticket must have:
```
Title:       [imperative verb] + [what] — e.g. "Implement reading streak in /lib/stats.ts"
Epic link:   one of the 9 epics above
Story points: 1 (small) / 2 (medium) / 3 (large)
Labels:      ui | logic | persistence | animation | bug
Acceptance criteria (minimum 2 bullets):
  - [ ] Specific, testable outcome
  - [ ] Edge case or error state handled
```

### Ticket Lifecycle Rules

- **Never skip columns.** Every ticket moves To Do → In Progress → In Review → Done
- **One ticket at a time** in "In Progress" per person (this is solo — so max 1)
- **Move to "In Review"** when the feature works on device and passes self-review checklist
- **Move to "Done"** only after the corresponding commit is pushed to GitHub

### MCP Commands — Use These Patterns

When asked to manage Jira via MCP, use these operations:

```
Create epic:   POST /rest/api/3/issue  (issuetype: Epic)
Create ticket: POST /rest/api/3/issue  (issuetype: Story, parent: epicId)
Update status: POST /rest/api/3/issue/{id}/transitions
Add comment:   POST /rest/api/3/issue/{id}/comment
Get board:     GET  /rest/agile/1.0/board/{boardId}/sprint
```

**When the student says "create tickets for [feature]":**
1. Identify the parent Epic
2. Break the feature into 2–4 tickets max
3. Write acceptance criteria before creating
4. Create via MCP, return the ticket keys (e.g. `MAQRA-12`)

**When the student says "move [ticket] to done":**
1. Verify a commit reference exists (ask if not)
2. Transition the ticket
3. Log the commit hash in a comment on the ticket

### Daily Standup Prompt

At the start of each session, if asked for a standup, query Jira and report:
```
Yesterday: tickets moved to Done
Today:     ticket moving to In Progress (with key + title)
Blockers:  any ticket stuck in In Progress > 4 hours
```

---

## GitHub Management

All code lives on GitHub. One repo, one branch per feature, PRs into `main`.

### Repo Structure

```
Repository name: maqra
Visibility:      Public (required for submission)
Default branch:  main
Branch pattern:  feature/MAQRA-{ticket-number}-{short-slug}
                 e.g. feature/MAQRA-7-stopwatch-hook
```

### Commit Convention — Enforce This

Every commit message must follow:
```
type(scope): short description [MAQRA-XX]

Types:  feat | fix | style | refactor | chore | docs | test
Scope:  store | screen | hook | lib | ui | config | assets

Examples:
  feat(store): add hydrate action to useBookStore [MAQRA-14]
  fix(hook): clear interval on stopwatch unmount [MAQRA-21]
  style(ui): apply Majorelle Blue to progress ring [MAQRA-9]
  chore(config): add JetBrains Mono font assets [MAQRA-3]
```

**Never commit:**
- `fix stuff`
- `wip`
- `asdfgh`
- Commits with no ticket reference

### Branching Rules

```
main          → always runnable. npx expo start must work at all times.
feature/*     → one ticket, one branch. Merge via PR only.
```

**Branch lifecycle:**
1. Create branch from `main`: `git checkout -b feature/MAQRA-7-stopwatch-hook`
2. Commit incrementally (minimum 3 commits per feature, not one giant dump)
3. Open PR when ticket is "In Review"
4. PR title = ticket title. PR body = acceptance criteria checklist
5. Merge to `main`, delete the branch
6. Move Jira ticket to Done, add commit hash as comment

### PR Template — Always Use

```markdown
## MAQRA-{XX} — {Ticket Title}

### What changed
- 

### Acceptance criteria
- [ ] criterion 1
- [ ] criterion 2

### Self-review checklist
- [ ] No logic in /components
- [ ] AsyncStorage calls wrapped in try/catch
- [ ] useEffect cleanups present where needed
- [ ] Tested on physical device
- [ ] No TypeScript `any` types added
- [ ] RTL tested if Arabic content is involved
```

### Commit Frequency Rules

The evaluator inspects commit history. Flag these anti-patterns:

| Anti-pattern | What to do instead |
|---|---|
| One massive commit at end of day | Commit after each logical unit (finish a hook, finish a store action) |
| Committing broken code to main | Use feature branches, only merge working code |
| Skipping ticket refs in commits | Add `[MAQRA-XX]` — non-negotiable |
| Pushing generated logic without understanding | Student must be able to explain every committed line |

### `.gitignore` — Must Include

```
node_modules/
.expo/
dist/
*.log
.env
.env.local
```

### README.md — Required Sections

The README is a deliverable. It must contain:

```markdown
# Maqra

## Architecture
Folder structure diagram + explanation of UI / store / lib / hooks split

## Vibe Coding Workflow
What Stitch generated vs what was written manually (be specific per screen)

## Stitch Prompts
(or link to STITCH.md)

## Installation
npx expo install
npx expo start

## Environment
No external APIs. 100% local with AsyncStorage.

## Screenshots
3 screens — light mode + Arabic RTL if possible
```

### GitHub ↔ Jira Sync

Keep these in sync manually (or via MCP if integration available):

| GitHub event | Jira action |
|---|---|
| Branch created `feature/MAQRA-7-*` | Move ticket to "In Progress" |
| PR opened | Move ticket to "In Review" |
| PR merged to main | Move ticket to "Done", paste commit hash in comment |
| Bug found on main | Create new `MAQRA-XX` bug ticket, reference in commit |