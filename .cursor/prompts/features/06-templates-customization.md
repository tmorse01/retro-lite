# Templates & Customization

**Priority:** Low (Phase 3+)  
**Status:** Future Enhancement

## Overview

Allow facilitators to customize retro templates and board settings.

## Features

### 1. Retro Templates

- **Classic**: Went Well / Needs Improvement / Action Items.
- **4Ls**: Liked / Learned / Lacked / Longed For.
- **Start/Stop/Continue**: What to start / stop / continue.
- **Mad/Sad/Glad**: Emotional retrospective.
- **Custom**: Facilitator defines columns.

### 2. Column Customization

- Rename columns.
- Add/remove columns.
- Reorder columns.
- Set column colors/themes.

### 3. Board Settings

- Time limit per phase (optional countdown timer).
- Anonymous mode (hide author names).
- Read-only mode (for sharing results).

## Implementation Notes

- Templates stored in database or configuration files.
- Column customization requires updating `columns` table schema.
- Board settings stored in `boards` table as JSON or separate columns.

## Related Features

- Templates affect [Phased Workflow](./01-phased-workflow.md) column structure.
- Settings can enhance [Collaboration](./07-collaboration.md) features.

