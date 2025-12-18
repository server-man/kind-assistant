# MCP Connections Guide

## What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI models to external tools and data sources. In the context of this platform, MCP connections extend the AI's capabilities during development.

## Important Distinction

**MCP connectors extend the Lovable agent** (the AI that helps build your app), NOT the application you're building. The tools from MCP connectors are available to help build better apps with more context, but your final user-facing application cannot call MCP tools directly.

## Available MCP Connectors

### Development Tools

| Connector | Purpose |
|-----------|---------|
| **Atlassian** | Access Jira issues and Confluence pages |
| **Linear** | Access Linear issues and project data |
| **GitHub** | Access repositories, issues, PRs |

### Design Tools

| Connector | Purpose |
|-----------|---------|
| **Miro** | Access Miro boards and diagrams |
| **Figma** | Access design files and components |

### Productivity Tools

| Connector | Purpose |
|-----------|---------|
| **Notion** | Access Notion pages and databases |

### Automation

| Connector | Purpose |
|-----------|---------|
| **n8n** | Access and power apps with n8n workflows |

## Setting Up MCP Connections

### 1. Enable in Project Settings

1. Go to **Project Settings → Connectors**
2. Find the desired MCP connector
3. Click to enable and authenticate

### 2. Access Scopes

MCP connectors can be scoped to:

- **Workspace level**: Available to all projects
- **Project level**: Only for specific project
- **Owner level**: Personal access only

## n8n Integration

### Setup Steps

1. **Enable MCP Access in n8n**:
   - Go to Settings → MCP access in your n8n instance
   - Toggle "Enable MCP access"
   - Copy the MCP URL provided

2. **Make Workflows Available**:
   - Open each workflow you want to expose
   - Go to workflow Settings
   - Toggle "Available in MCP"

### Common Pitfall

> "I connected n8n but see no workflows"

This is the most common issue. You must enable "Available in MCP" for **each individual workflow** in the workflow editor's Settings.

### Permissions

- Enabling MCP access requires **owner** or **admin** permissions
- Regular n8n users cannot enable MCP access
- Check your role if the option is missing

## Using MCP in Development

### When MCP Helps

- Importing project requirements from Linear/Jira
- Referencing design specs from Figma/Miro
- Pulling documentation from Notion
- Triggering automation workflows

### Example Workflow

1. Connect Linear MCP
2. Ask: "Create a component based on issue LIN-123"
3. Agent reads issue details via MCP
4. Agent implements the component with context

## Security Considerations

### Access Control

- MCP connections are authenticated via OAuth
- Tokens are stored securely by Lovable
- Revoke access anytime from Project Settings

### Data Exposure

- Only data you have access to is available
- Agent cannot access private data without your auth
- Logs show what data was accessed

## Pitfalls and Solutions

### Connection Issues

| Problem | Solution |
|---------|----------|
| "No data returned" | Check authentication is still valid |
| "Permission denied" | Verify your access level in the service |
| "Timeout" | The external service may be slow/down |

### n8n Specific

| Problem | Solution |
|---------|----------|
| No workflows visible | Enable "Available in MCP" per workflow |
| Can't enable MCP | Need owner/admin role in n8n |
| Workflows not executing | Check workflow is active |

### General Tips

1. **Test connections** after setup
2. **Start small** - enable one workflow at a time
3. **Check logs** when things don't work
4. **Refresh tokens** if connections fail after working

## Limitations

### What MCP Cannot Do

- Provide runtime API access to your app's users
- Replace proper backend integrations
- Store data in external services from user actions
- Authenticate end users against external services

### When to Use Standard Connectors Instead

If you need your **application** to:
- Call external APIs at runtime
- Authenticate users against third-party services
- Store/retrieve data from external sources

Use **Standard Connectors** (ElevenLabs, Firecrawl, Perplexity, etc.) instead of MCP connectors.

## Best Practices

1. **Minimal Permissions**: Only connect what you need
2. **Regular Review**: Audit connected services periodically
3. **Clear Descriptions**: Use descriptive names for workflows
4. **Documentation**: Document custom MCP setups for team
5. **Testing**: Test MCP connections before relying on them
