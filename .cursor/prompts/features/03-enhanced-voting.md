# Enhanced Voting

**Priority:** High (Phase 2)  
**Status:** Planned

## Current MVP

Simple upvote counter.

## Future Enhancements

### 1. Vote Limits

- Facilitator sets: "Each person gets 5 votes" or "Unlimited votes".
- Track votes per participant (via session/localStorage or user ID).
- Visual feedback: "You've used 3 of 5 votes".

### 2. Vote Distribution

- Allow distributing multiple votes on one card (e.g., "Give this card 3 votes").
- Useful for prioritizing critical items.

### 3. Vote History

- Show who voted (optional, privacy-respecting).
- Timeline of votes for transparency.

### 4. Vote-Based Sorting

- Auto-sort cards by vote count (highest first).
- Option to lock sort order after voting phase.

## Implementation Notes

- Vote tracking can use localStorage/sessionStorage for anonymous users.
- For authenticated users, track votes in database with user_id.
- Consider vote limits per phase (e.g., 5 votes during voting phase only).

## Related Features

- Part of [Phased Workflow](./01-phased-workflow.md) voting phase.
- Vote counts influence grouping and action item prioritization.

