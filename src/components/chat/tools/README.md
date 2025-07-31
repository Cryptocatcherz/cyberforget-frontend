# Chat-Integrated Tools System

This directory contains the modular tool system that integrates all free tools directly into the chat interface.

## Overview

The chat tools system allows users to access all security tools directly within the chat conversation, eliminating the need to navigate to separate pages. Tools can be triggered by:

1. **Commands**: Type `/password-check`, `/email-breach`, etc.
2. **Natural language**: "check my password", "scan my email"
3. **Tool manager**: Click the 🛠️ button for visual tool access

## Architecture

### Core Components

- **`ToolRegistry.js`** - Central registry of all available tools
- **`BaseTool.js`** - Base component that all tools extend
- **`ChatToolManager.js`** - Manages tool lifecycle in chat
- **Individual tool components** - Specific tool implementations

### Available Tools

| Command | Tool | Description |
|---------|------|-------------|
| `/password-check` | Password Checker | Check password strength and breaches |
| `/email-breach` | Email Breach Scanner | Check if email appears in data breaches |
| `/data-broker-scan` | Data Broker Scanner | Scan for personal info on broker sites |
| `/file-scan` | File Scanner | Scan files for viruses and malware |
| `/delete-account` | Account Deleter | Help delete accounts from platforms |
| `/area-code` | Area Code Checker | Check phone numbers for scams |

## Usage Examples

### For Users

1. **Command mode**: Type `/password-check` in chat
2. **Natural language**: "I want to check if my email was breached"
3. **Tool manager**: Click the 🛠️ button to see all tools
4. **Tool chaining**: Tools can trigger other tools (e.g., compromised email → data broker scan)

### For Developers

#### Adding a New Tool

1. Create the tool component:
```javascript
// NewTool.js
import React, { useState } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';

const NewTool = ({ onComplete, onClose }) => {
  // Tool implementation
  return (
    <BaseTool
      toolName="My New Tool"
      toolIcon="🔧"
      toolDescription="Description of what this tool does"
      onClose={onClose}
    >
      {/* Tool content */}
    </BaseTool>
  );
};

export default NewTool;
```

2. Register in `ToolRegistry.js`:
```javascript
import NewTool from './NewTool';

const TOOL_REGISTRY = {
  '/new-tool': {
    component: NewTool,
    name: 'My New Tool',
    description: 'Tool description',
    icon: '🔧',
    triggers: ['new', 'tool', 'my tool'],
    command: '/new-tool'
  },
  // ... other tools
};
```

#### Tool Communication

Tools communicate back to the chat via the `onComplete` callback:

```javascript
const handleComplete = () => {
  onComplete({
    type: 'tool_result',
    data: resultData,
    summary: 'Brief description of what happened'
  });
};
```

#### Tool Chaining

Tools can trigger other tools:

```javascript
onComplete({
  type: 'trigger_tool',
  tool: '/other-tool',
  context: 'Additional context for the next tool'
});
```

## Styling

All tools inherit base styles from `BaseTool.css`. Tool-specific styles should be in separate CSS files following the naming convention: `{ToolName}Tool.css`.

### CSS Structure
```css
/* Tool-specific styles */
.tool-name-content {
  /* Custom content styles */
}

.tool-name .custom-class {
  /* Custom component styles */
}

/* Follow the existing color scheme */
--primary-color: #42ffb5;
--background-dark: rgba(255, 255, 255, 0.03);
--border-color: rgba(255, 255, 255, 0.1);
```

## Integration Points

### ChatPage Integration

The `ChatPage` component includes:
- Tool command detection in message handling
- Tool manager toggle button
- Tool result handling

### useChat Hook Integration

Enhanced message processing can be added to the `useChat` hook to:
- Detect tool suggestions
- Handle tool results
- Manage tool state

## Best Practices

1. **Keep tools focused** - Each tool should have a single, clear purpose
2. **Consistent UX** - Use the BaseTool wrapper for consistent behavior
3. **Error handling** - Always handle errors gracefully with ToolError component
4. **Loading states** - Show progress with ToolLoading component
5. **Results display** - Use ToolResult for consistent result formatting
6. **Mobile responsive** - Test all tools on mobile devices

## Testing

To test a tool:

1. Start the development server
2. Navigate to the chat page
3. Try different trigger methods:
   - Type the command: `/tool-name`
   - Use natural language: "I want to [tool purpose]"
   - Click the tool manager button
4. Test error cases and edge conditions
5. Verify mobile responsiveness

## Future Enhancements

- **Tool favorites** - Let users save frequently used tools
- **Tool history** - Show recently used tools
- **Tool analytics** - Track tool usage patterns
- **Tool permissions** - Restrict tools based on subscription level
- **Tool keyboard shortcuts** - Quick access via keyboard
- **Tool suggestions** - AI-powered tool recommendations

## Troubleshooting

### Common Issues

1. **Tool not appearing in registry**
   - Check import statement in ToolRegistry.js
   - Verify component export

2. **Tool not triggering from chat**
   - Check trigger words in registry
   - Verify command format

3. **Styling issues**
   - Import tool-specific CSS
   - Check CSS class naming conflicts

4. **Tool crashes**
   - Wrap in error boundaries
   - Check prop passing from BaseTool

### Debug Mode

Set `REACT_APP_DEBUG=true` in environment to enable:
- Tool trigger logging
- Registry inspection
- Performance monitoring

---

For questions or issues, check the main project documentation or create an issue in the repository.