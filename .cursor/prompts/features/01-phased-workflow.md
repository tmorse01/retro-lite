# Phased Retrospective Workflow

**Priority:** High (Phase 2)  
**Status:** Planned

## Overview

Azure DevOps uses a structured workflow: **Gather → Group → Vote → Actions**. RetroLite should support this progression while keeping it optional and non-intrusive.

## Phase System

### 1. Gathering Phase (Default/MVP)

- Participants add cards freely to columns.
- No restrictions on editing/deleting.
- Visual indicator: "Gathering ideas..."

### 2. Grouping Phase (Future)

- Facilitator locks gathering (optional).
- Cards can be grouped into themes/topics.
- Grouped cards appear in collapsible groups within columns.
- Visual indicator: "Grouping related items..."

### 3. Voting Phase (Enhanced)

- Voting becomes more prominent.
- Option to limit votes per participant (e.g., "You have 5 votes").
- Visual indicator: "Voting on priorities..."

### 4. Actions Phase (Future)

- High-voted items move to "Action Items" column automatically or manually.
- Action items can have assignees, due dates, and status tracking.
- Visual indicator: "Defining action items..."

## Implementation Notes

- Add `phase` enum to `boards` table: `'gathering' | 'grouping' | 'voting' | 'actions'`.
- Phase transitions controlled by facilitator (or auto-advance based on time/conditions).
- UI shows current phase badge in header.
- Previous phases remain viewable but read-only (optional).

## Related Features

- See [Smart Grouping](./02-smart-grouping.md) for grouping implementation details.
- See [Enhanced Voting](./03-enhanced-voting.md) for voting phase enhancements.
- See [Action Items Management](./04-action-items.md) for actions phase features.

