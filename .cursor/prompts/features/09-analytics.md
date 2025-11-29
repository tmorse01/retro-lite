# Analytics & Insights

**Priority:** Low (Phase 4+)  
**Status:** Future Enhancement

## Overview

Analytics to track retro trends and team health over time.

## Features

### 1. Retro History

- View all past retros for a team/board.
- Trends over time: "We've been talking about CI/CD for 3 sprints".

### 2. Pattern Detection

- Identify recurring themes across retros.
- "This issue appears in 80% of your retros".

### 3. Team Health Score

- Derived metric: balance of Went Well vs Needs Improvement.
- Track improvement over time.

## Implementation Notes

- Requires storing retro snapshots or historical data.
- Analytics can be computed on-demand or pre-aggregated.
- Privacy considerations: ensure analytics respect user preferences.

## Related Features

- Can leverage [AI-Powered Features](./05-ai-features.md) for pattern detection.
- Builds on [Export & Integration](./08-export-integration.md) data.

