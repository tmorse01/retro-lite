# Smart Grouping (Better Than Drag-and-Drop)

**Priority:** High (Phase 2)  
**Status:** Planned

## Problem Statement

Azure DevOps grouping via drag-and-drop is **painful** because:

- Requires precise mouse control.
- Doesn't work well on mobile/touch devices.
- Hard to group many cards at once.
- Can be slow and error-prone.

## RetroLite's Better Approach: Multi-Method Grouping

### Method 1: Multi-Select + Quick Group (Primary)

- **Checkbox selection**: Each card has a checkbox (visible in grouping phase).
- **Bulk selection**: "Select All" / "Select None" / "Select Similar" (AI-powered).
- **Group action**: Select multiple cards → Click "Create Group" → Enter group name → Cards grouped instantly.
- **Mobile-friendly**: Large touch targets, works perfectly on tablets/phones.
- **Keyboard shortcuts**: Shift+Click for range selection, Ctrl+Click for multi-select.

### Method 2: Tag-Based Grouping (Secondary)

- Cards can have **tags** (e.g., "Process", "Tooling", "Communication").
- Tags appear as small badges on cards.
- Facilitator can create groups from tags: "Group all cards tagged 'Process'".
- Auto-suggest tags based on card content (AI-powered, optional).

### Method 3: AI-Assisted Grouping (Tertiary)

- **"Suggest Groups" button**: AI analyzes card content and suggests logical groupings.
- Shows preview: "Group A: Process-related (3 cards)", "Group B: Tooling (2 cards)".
- Facilitator reviews and accepts/rejects/modifies suggestions.
- Uses semantic similarity (embeddings) to find related cards.

### Method 4: Quick Group Buttons (For Small Retros)

- Pre-defined group buttons: "Process", "People", "Tools", "Other".
- Click a card → Click a group button → Card assigned instantly.
- Fastest method for small teams (< 10 cards).

## Group Display

- Groups appear as **collapsible sections** within columns.
- Group header shows: group name, card count, total votes.
- Cards can be moved between groups or ungrouped individually.
- Groups can be renamed, merged, or split.

## Data Model Addition

```sql
-- Groups: collections of related cards
create table groups (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  column_id uuid references columns(id) on delete cascade,
  name text not null,
  sort_order int not null,
  created_at timestamptz default now(),
  unique (board_id, column_id, sort_order)
);

-- Card-group relationship (many-to-many)
create table card_groups (
  card_id uuid references cards(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  primary key (card_id, group_id)
);

-- Add group_id directly to cards for simpler queries (optional)
alter table cards add column group_id uuid references groups(id) on delete set null;
```

## UX Flow Example

1. Facilitator clicks "Start Grouping" → Phase changes, checkboxes appear on cards.
2. Facilitator selects 3 related cards (checkboxes).
3. Clicks "Group Selected" → Modal: "Group name?" → Types "CI/CD Issues".
4. Cards instantly collapse into a group labeled "CI/CD Issues (3)".
5. Other participants see grouping happen in real-time.
6. Cards can be ungrouped or moved to different groups via simple actions.

## Related Features

- Requires [Phased Workflow](./01-phased-workflow.md) to enable grouping phase.
- See [AI-Powered Features](./05-ai-features.md) for AI-assisted grouping implementation.

