# AI-Powered Features

**Priority:** Low (Phase 3+)  
**Status:** Future Enhancement

## Overview

AI features to enhance the retro experience with intelligent assistance.

## Features

### 1. Smart Tagging

- Auto-suggest tags as cards are created.
- Uses NLP to extract themes: "Process", "Communication", "Technical Debt".

### 2. Duplicate Detection

- Warn: "This card is similar to: [existing card]".
- Suggest merging duplicates.

### 3. Summary Generation

- AI generates a concise summary of the retro.
- Highlights top themes, common patterns, key action items.

### 4. Sentiment Analysis

- Visual indicator: "Went Well" cards are positive, "Needs Improvement" are constructive.
- Help identify if retro is balanced or skewed.

## Implementation Notes

- Requires AI/ML service integration (OpenAI, Anthropic, or similar).
- Consider privacy implications - ensure card content is handled securely.
- Make AI features opt-in per board to respect user preferences.

## Related Features

- Supports [Smart Grouping](./02-smart-grouping.md) Method 3 (AI-Assisted Grouping).
- Can enhance [Analytics & Insights](./09-analytics.md) with pattern detection.

