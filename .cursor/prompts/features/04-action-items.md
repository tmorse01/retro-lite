# Action Items Management

**Priority:** Medium (Phase 2-3)  
**Status:** Planned

## Current MVP

"Action Items" is just another column.

## Future Enhancements

### 1. Action Item Properties

- **Assignee**: Who owns this action (dropdown or text input).
- **Due Date**: When should this be completed.
- **Status**: "Not Started" | "In Progress" | "Done" | "Blocked".
- **Priority**: Low | Medium | High (derived from votes or manual).

### 2. Action Items View

- Separate view: `/board/[id]/actions` showing all action items in a table/list.
- Filter by assignee, status, due date.
- Export to CSV/Markdown for tracking.

### 3. Follow-Up Retros

- Link action items from previous retro to new retro.
- Show "Carried Over" items from last sprint.
- Mark actions as "Completed" or "Still Relevant".

## Data Model Addition

```sql
alter table cards add column assignee text;
alter table cards add column due_date date;
alter table cards add column status text default 'not_started';
alter table cards add column priority text default 'medium';
alter table cards add column parent_action_id uuid references cards(id); -- for follow-ups
```

## Related Features

- Part of [Phased Workflow](./01-phased-workflow.md) actions phase.
- Can be exported via [Export & Integration](./08-export-integration.md) features.

