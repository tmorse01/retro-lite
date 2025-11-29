# Export & Integration

**Priority:** Medium (Phase 3+)  
**Status:** Planned

## Overview

Export retro results and integrate with external tools.

## Features

### 1. Export Formats

- **Markdown**: Clean, formatted summary.
- **PDF**: Printable retro report.
- **CSV**: For action items tracking.
- **JSON**: For API integrations.

### 2. Integrations (Phase 2+)

- **Jira**: Create tickets from action items.
- **Slack**: Post retro summary to channel.
- **Notion**: Export to Notion database.
- **GitHub Issues**: Create issues from action items.
- **Email**: Send retro summary via email.

### 3. API

- Public API for programmatic access.
- Webhooks for retro completion events.

## Implementation Notes

- Export functions can be server-side or client-side generation.
- Integrations require OAuth/API key setup per service.
- API should follow RESTful conventions with proper authentication.

## Related Features

- Exports [Action Items](./04-action-items.md) data.
- Can be triggered from [Phased Workflow](./01-phased-workflow.md) completion.

