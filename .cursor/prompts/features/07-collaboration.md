# Collaboration Enhancements

**Priority:** Low (Phase 3+)  
**Status:** Future Enhancement

## Overview

Enhanced collaboration features for better team interaction during retros.

## Features

### 1. Presence Indicators

- Show who's currently viewing the board (avatars/initials).
- Real-time cursor/selection indicators (optional, advanced).

### 2. Comments/Threads

- Add comments to cards for discussion.
- Threaded conversations on specific items.

### 3. Reactions

- Quick emoji reactions (👍, ❤️, 😮, 💡) on cards.
- Faster than typing comments.

### 4. Mentions

- @mention participants in comments.
- Notifications (if auth is enabled).

## Implementation Notes

- Presence requires WebSocket/Realtime connection tracking.
- Comments need new `comments` table with threading support.
- Reactions can be simple counters or per-user tracking.
- Mentions require user identification (auth or session-based).

## Related Features

- Builds on existing [Realtime Collaboration](../retrolite-project-prompt.md#42-realtime-collaboration) infrastructure.
- Can integrate with [Templates & Customization](./06-templates-customization.md) anonymous mode.

