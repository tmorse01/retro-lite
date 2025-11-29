# RetroLite – Weekend Full-Stack Retro Board

**Project Type:** Full-stack web app  
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase (DB/Auth/Realtime) + Vercel + v0.dev + Cursor

**IMPORTANT:** This project **MUST** use Next.js 16. Ensure all initialization and setup uses Next.js 16 specifically.

You are an AI pair-programmer helping build **RetroLite**, a super lightweight **sprint retrospective board** app. The goal is to ship a **fully functional, deployed** app in a weekend, with a clean codebase that can be extended later.

This document defines:

- Product vision & UX
- Tech stack & architecture
- Data model (Supabase)
- API & realtime behavior
- Frontend routes & components
- Implementation phases for Cursor agents
- A v0.dev prompt to generate initial UI

---

## 1. Product Vision

RetroLite is a **facilitation tool** for Agile/Scrum retrospectives.

**Core use case:**

- A facilitator creates a retro board for a team.
- Team members open a link and add feedback cards in three columns:
  - **Went Well**
  - **Needs Improvement**
  - **Action Items**
- Participants upvote cards so the team can focus on the most important items.
- The facilitator exports the results to share with the team or paste into other tools.

**Key constraints:**

- Must feel **fast, simple, and frictionless**.
- MVP should work with **no email-based login for participants** (optional later).
- Designed to work on **desktop and mobile**.

---

## 2. High-Level Feature Set (MVP)

### 2.1 Must-Have Features

1. **Landing Page**

   - Explains what RetroLite is.
   - CTA: “Start a Retro” → creates a new board.
   - CTA: “View Demo Board” → loads a pre-seeded demo board.

2. **Create Board**

   - User enters a **board title** (e.g., “Sprint 42 – API Team Retro”).
   - Optional: team/sprint name.
   - On create:
     - New board row in Supabase.
     - Default 3 columns are created.
     - Redirect to `/board/[id]`.

3. **Board View**

   - Display **top navigation** with:
     - App name/logo.
     - Board title.
     - “Share” button → opens a dialog with shareable link.
     - (Optional) “Export” menu with placeholder actions.
   - Show 3 columns:
     - Went Well
     - Needs Improvement
     - Action Items
   - In each column:
     - List of cards.
     - “Add card” control (inline input or modal).
     - Each card supports:
       - Content text.
       - Optional author name.
       - Vote button with count.
       - Edit content.
       - Delete card.
   - Vote count should visually influence card appearance (e.g., more votes = stronger highlight).

4. **Realtime Collaboration**

   - Multiple clients can be on the same board and see:
     - New cards appear live.
     - Card edits appear live.
     - Vote counts update live.
   - Use **Supabase Realtime** and/or RLS-compatible subscriptions.

5. **Demo Board**
   - `/board/demo` route (or a special ID) populated with static example data, no DB required.
   - Helpful for v0.dev and visual testing.

### 2.2 Nice-to-Have (Still MVP-Friendly)

- Column-level stats: number of cards, total votes.
- Minimal **phase indicator**:
  - Brainstorm → Vote → Discuss.
- Basic **export**:
  - Generate a Markdown summary string of the board (section per column, sorted by votes).

### 2.3 Out-of-Scope for Initial Weekend Build

- Advanced auth/roles.
- Team accounts/workspaces.
- Complex permissions per board.
- Integrations (Jira, Slack, Notion, etc.).
- AI grouping/summarization (can be Phase 2).

---

## 3. Tech Stack & Architecture

### 3.1 Frontend

- **Framework:** Next.js 16 (App Router) - **REQUIRED VERSION**
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React hooks + local state for UI; React Query optional but not required for MVP.
- **Realtime:** Supabase Realtime subscriptions on `boards`, `columns`, `cards` tables.
- **Deployment:** Vercel

**Setup Command:** When initializing the project, use:

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

Then verify `package.json` shows `"next": "^16.0.0"` or higher. If not, update it manually.

### 3.2 Backend (Supabase)

- **Database:** Postgres (via Supabase)
- **Auth:** Supabase Auth (optional for board owners; participants can be anonymous using URL access).
- **Realtime:** Enabled on `cards` and `columns` tables.
- **Security:** Row Level Security (RLS) to limit board access by board-specific tokens (simple implementation for MVP).

For the MVP, you can treat all board access as allowed if a user has the correct URL/id + optional join code. Proper multi-tenant auth can be a later enhancement.

---

## 4. Data Model (Supabase Schema)

NOTE: Adjust naming/constraints as needed, but keep the semantics.

```sql
-- Boards: a single retro session
create table boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  invite_code text unique, -- short code, can be derived or random
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_public boolean default true
);

-- Columns: Went Well / Needs Improvement / Action Items
create table columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  title text not null,
  sort_order int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (board_id, sort_order)
);

-- Cards: feedback items created by participants
create table cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  column_id uuid references columns(id) on delete cascade,
  content text not null,
  author text,
  votes int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

To simplify access, `board_id` is included directly on `cards` as well as via `column_id`.

### Basic RLS Idea (MVP)

For MVP, you can:

- Enable RLS but allow `select/insert/update/delete` for any row where `is_public = true` for its board.
- No user-specific auth is necessary to collaborate on a public board.

Example (pseudo):

```sql
alter table boards enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;

create policy "Public boards read/write"
on boards for select using (is_public = true);

-- Similar policies for columns/cards referencing boards where is_public = true
```

In a later phase, add support for private boards with owner-only editing.

---

## 5. Routes & Screens

### 5.1 `/` – Landing Page

**Goal:** Explain RetroLite in one glance and drive users to start a retro.

**Content:**

- Logo + app name: **RetroLite**.
- Tagline: “Run focused retros in minutes.”
- Subtext: “Create a retro board, invite your team, capture feedback, and prioritize actions without the bloat.”
- CTA buttons:
  - Primary: “Start a Retro” → `/board/new`
  - Secondary: “View Demo Board” → `/board/demo`
- Feature highlights (3 items):
  - Fast Setup
  - Live Collaboration
  - Prioritize with Votes
- Footer with placeholder links: Privacy, Terms, GitHub.

### 5.2 `/board/new` – Create Board

**Goal:** Small, focused form to create a new board.

Fields:

- Retro Title (required)
- Optional: Sprint Name / Team Name (can be appended to title)
- Template selection (non-functional dropdown, just show default template)

Actions:

- “Create Board” → POST to API → redirect to `/board/[id]`.

### 5.3 `/board/[id]` – Board View

**Goal:** The main facilitation space.

Layout:

- Top app bar:

  - Left: RetroLite logo (small) + board title.
  - Right:
    - Share button → opens modal with share URL & copy button.
    - Export dropdown (for now, just triggers toast with “Coming soon” or returns Markdown text summary).

- Below app bar: **Columns** in a responsive grid:
  - Desktop: 3 columns side-by-side.
  - Mobile: stack columns vertically.

Each column:

- Title (e.g., “Went Well”).
- Badge showing count of cards.
- Optional total votes.
- “Add card” control (either inline input row, or “+ Add card” button → modal).

Each card:

- Card text.
- Author (small, muted).
- Vote button with count on the right.
- Optional actions: Edit, Delete (e.g. icons appearing on hover).

Interactions:

- Adding a card: inserts into Supabase; realtime broadcast updates board.
- Voting: increments `votes` on that card; realtime update.
- Editing/deleting: updates/removes card row; realtime update.

### 5.4 `/board/demo` – Static Demo Board

Static, front-end only board for previewing UI without Supabase.

- Hard-coded card data (mocked).
- Same layout as main board.
- All interactions in local state only.

---

## 6. API & Realtime Behavior

### 6.1 API Outline

You can use:

- **Server actions** (Next.js 16 server actions), or
- `/api/*` routes in Next.js 16 calling Supabase client-side or via server-side SDK.

Note: Next.js 16 includes enhanced server actions and improved App Router features. Prefer server actions for mutations when possible.

Suggested API behaviors:

1. **Create Board**

   - `POST /api/boards`
   - Body: `{ title: string }`
   - Creates board + 3 columns:
     - Went Well (sort_order 0)
     - Needs Improvement (sort_order 1)
     - Action Items (sort_order 2)
   - Returns: `{ id, invite_code, ... }`

2. **Get Board Detail**

   - `GET /api/boards/[id]`
   - Returns board + columns + cards.

3. **Create Card**

   - `POST /api/cards`
   - Body: `{ boardId, columnId, content, author? }`
   - Returns new card.

4. **Update Card**

   - `PATCH /api/cards/[id]`
   - Updates `content` and optionally `author`.

5. **Delete Card**

   - `DELETE /api/cards/[id]`

6. **Vote Card**
   - `POST /api/cards/[id]/vote`
   - Increments `votes` by 1.
   - For MVP, no duplicate vote detection is necessary.

### 6.2 Realtime Subscriptions

Channel name example: `board:{boardId}`

Subscribe to:

- Inserts/updates/deletes on `cards` where `board_id = boardId`.
- Optional: updates to `columns` (for future custom column support).

On receiving events:

- Merge into local state (card add/update/delete).
- Keep UI optimistic for fast feedback.

---

## 7. Frontend Components (Suggested)

Implement a set of clean, reusable components:

1. **`AppHeader`**

   - Props: `boardTitle?`, optional actions.
   - Renders logo, title, share/export buttons.

2. **`BoardLayout`**

   - Arranges header + main content area.

3. **`Column`**

   - Props: `title`, `cards`, callbacks for CRUD and vote.
   - Handles add-card UI & empty state.

4. **`CardItem`**

   - Shows content, author, vote count.
   - Buttons: upvote, edit, delete.
   - Supports inline edit or modal-based edit.

5. **`ShareBoardDialog`**

   - Modal showing share URL and copy button.

6. **`EmptyState`**
   - For when a column has no cards.

Use shadcn/ui primitives for:

- `Button`
- `Input`
- `Textarea`
- `Dialog`
- `DropdownMenu`
- `Badge`
- `Toast` / `useToast`

---

## 8. Styling & UX Guidelines

- Overall vibe: **calm, modern, facilitation tool**.
- Color palette: soft gray background (`bg-slate-50`), cards on white (`bg-white`), accent colors in blue/purple, with yellow/green highlight for high-vote cards.
- Use a **max-width container** for main content on desktop (~1200px).
- Card hover effect: subtle shadow + 1–2px translateY.
- Transitions: `transition-all` for hover/focus states.

Mobile:

- Columns stack vertically.
- Header stays visible at the top.
- Buttons large enough for touch.

---

## 9. v0.dev Frontend Mock Prompt

Use this prompt in **v0.dev** to generate the initial React/Next.js UI mock (front-end only, with mocked state). You can later wire it to Supabase in Cursor.

````text
You are designing the front-end UI for a web app called **RetroLite**.

RetroLite is a super lightweight **sprint retrospective board** used by small dev teams. The app is simple, fast, and focused: one board, three columns, cards, and votes.

### Tech + Constraints

- Use **React** with **Next.js 16 App Router** style structure. **MUST be Next.js 16.**
- Use **TypeScript**.
- Use **Tailwind CSS** for styling.
- Use **shadcn/ui** (or similar headless/primitive components) for inputs, buttons, modals, dialogs, dropdowns, and toasts.
- You do **not** need to wire up a real backend. Use mocked data and local state.
- Design should be **responsive** for desktop and mobile.
- Use modern, minimal styling with a calming but slightly playful palette (e.g. soft blues/purples with accent yellows/greens).
- Prioritize clarity and "facilitation" feel: like a tool a scrum master opens on a TV during standup.

---

## Overall UX Goals

- A facilitator can:
  1. Create a new retro board with a title.
  2. See 3 columns: “Went Well”, “Needs Improvement”, “Action Items”.
  3. Add, edit, delete cards in each column.
  4. Upvote cards (to prioritize discussion).
  5. Share a link (just a fake URL in the mock) with the team.

- Participants should:
  - Land directly on a board page and instantly understand how to add cards and vote.
  - See votes update visually in a clear way (e.g., badge with count, subtle color intensity).

---

## Pages / Routes to Design

### 1. Landing Page (`/`)

Design a simple marketing/landing page that explains RetroLite and leads users into creating a board.

**Content:**
- App name and logo placeholder ("RetroLite").
- Tagline like: “Run focused retros in minutes.”
- Short subtext: “Create a retro board, invite your team, capture feedback, and prioritize actions without the bloat.”
- Primary CTA button: “Start a Retro” → navigates to `/board/new`.
- Secondary CTA: “View Demo Board” → navigates to a sample board at `/board/demo`.
- Simple feature highlights section (3 columns):
  - “Fast Setup” – create a board in seconds.
  - “Live Collaboration” – everyone adds cards at once.
  - “Prioritize with Votes” – focus on what matters.
- Optional small footer: link placeholders for “Privacy”, “Terms”, “GitHub”.

The style should be clean and minimal, with a hero section and a simple illustration or abstract shapes that hint at columns/cards.

---

### 2. New Board Page (`/board/new`)

A small, focused form to create a new board.

**Elements:**
- Title input (“Retro Title”).
- Optional input: “Team name” or “Sprint name”.
- Dropdown or buttons for a template:
  - Default: “Went Well / Needs Improvement / Action Items”
  - (You don’t need to implement custom templates logic; just show the control.)
- Primary button: “Create Board”.
- On submit, navigate to `/board/[id]` with a mocked ID (e.g., `/board/demo`).

Use a card-like layout centered on the page with minimal distractions.

---

### 3. Board Page (`/board/[id]`)

This is the main screen and should feel like a **facilitation dashboard**.

**Layout:**
- A top app bar with:
  - Left: RetroLite logo/title.
  - Middle: Board title (e.g., “Sprint 42 – API Team Retro”).
  - Right:
    - “Share” button (click opens modal with a mock share link + copy button).
    - Optional “Export” dropdown (disabled or just placeholder actions).
- Below the app bar: three responsive columns laid out horizontally on desktop, stacked vertically on mobile.

**Columns:**
- Default columns:
  - “Went Well”
  - “Needs Improvement”
  - “Action Items”
- Each column is a card/panel with:
  - Column title.
  - “Add card” button or inline input at the top or bottom.
  - List of cards.

**Card component:**
- Contains:
  - Main text content (the feedback).
  - Small “author” label (optional text, maybe muted).
  - A vote control on the right bottom corner:
    - A small button (like a thumbs-up icon) and a vote count badge.
- Hover state with subtle elevation/shadow.
- Click to edit:
  - Implement an inline edit mode OR a small modal dialog.
- Delete icon (e.g., trash) shown on hover.

**Interactions (all client-side only, using mock state):**
- Add card: opens an inline textarea or modal to enter content + optional author name.
- Edit card: click card to edit.
- Delete card: small icon.
- Upvote card: clicking the vote button increments a numeric counter and visually highlights higher-voted cards (e.g., stronger border, subtle background color intensity, or badge color).

**Nice touches (still mock/local state only):**
- Show total number of cards and total votes per column in the column header.
- On mobile, columns should be vertically stacked, full width, with some spacing between them.

---

## Components to Implement

Create reusable components for:

1. `BoardLayout`
   - Receives board title and children columns.
   - Renders top nav / app bar with title, Share button, Export dropdown.

2. `Column`
   - Props: `title`, `cards`, `onAddCard`, `onCardUpdate`, `onCardDelete`, `onVote`.
   - Handles “Add card” button and renders list of `Card` components.

3. `Card`
   - Props: `content`, `author`, `votes`, handlers for edit/delete/vote.
   - Inline edit state or modal edit.

4. `ShareBoardDialog`
   - Simple dialog showing:
     - Mock share URL (e.g., `https://retrolite.app/board/demo`).
     - “Copy link” button with toast notification.

5. `EmptyState`
   - When a column has no cards, show a simple illustration/icon and text like: “No items yet. Add the first card.”

Use shadcn/ui primitives (Dialog, Button, Input, Textarea, DropdownMenu, etc.) to avoid re-inventing basic UI.

---

## Mock Data / State

For the board page (`/board/demo`), pre-populate the state with some example cards:

- Went Well:
  - “Great collaboration with the design team.”
  - “CI pipeline is much faster now.”
- Needs Improvement:
  - “Too many last-minute scope changes.”
  - “We need clearer acceptance criteria.”
- Action Items:
  - “Define ‘ready for development’ checklist.”
  - “Schedule weekly sync with product.”

Use local `useState` and simple TypeScript types like:

```ts
type Card = {
  id: string;
  columnId: string;
  content: string;
  author?: string;
  votes: number;
};
````

No API calls are required in this mockup.

---

## Visual Style

- Modern, flat, minimal.
- Soft background color (`bg-slate-50` or similar).
- Columns as slightly elevated panels with rounded corners.
- Subtle transitions on hover/focus.
- Use clear typography hierarchy:
  - Board title larger and bolder.
  - Column titles strong.
  - Card text readable and not tiny.

This is a **front-end-only mockup** that should feel very close to a real app. Focus on clear composition, pleasant visuals, and a facilitation-friendly experience.

```

---

## 10. Suggested Cursor Agent Plan (Optional)

If using multiple Cursor agents / tasks, you can split work like:

1. **Agent: Setup & Tooling**
   - Initialize **Next.js 16** + TypeScript + Tailwind + shadcn/ui.
     - Use: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
     - Verify Next.js 16 is installed: check `package.json` for `"next": "^16.0.0"` or higher.
     - If needed, manually update: `npm install next@latest react@latest react-dom@latest`
   - Configure Supabase client (server + client helpers).
   - Set up basic layout and global styles.

2. **Agent: Supabase Schema & API**
   - Create SQL migration or SQL snippets for `boards`, `columns`, `cards`.
   - Implement `/api/boards` and `/api/cards` routes or server actions.
   - Implement simple RLS policies for public boards.

3. **Agent: UI & Pages**
   - Implement `/`, `/board/new`, `/board/[id]`, `/board/demo` pages.
   - Implement components outlined in Section 7.

4. **Agent: Realtime & Data Wiring**
   - Wire up Supabase Realtime subscriptions for cards.
   - Add optimistic updates and error handling.

5. **Agent: Polish & UX**
   - Add loading states, empty states, and toasts.
   - Ensure mobile responsiveness and basic accessibility.

The final goal is a **deployed** app on Vercel with Supabase backing it, ready to share as a demo.
```
