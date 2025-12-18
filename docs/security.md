# Security Guidelines

## Overview

This document outlines security considerations for the AI Assistant Platform, particularly around admin access, credential storage, and API key management.

## Admin Security Model

### Localhost-Based Authentication

The platform uses localhost detection as the primary security mechanism:

```
✅ Allowed hosts:
- localhost
- 127.0.0.1
- 192.168.x.x (local network)
- 10.x.x.x (local network)
- ::1 (IPv6 localhost)

❌ Denied:
- Any public domain
- Any external IP
```

### Why This Approach?

| Benefit | Explanation |
|---------|-------------|
| Physical access required | Only someone at the machine can be admin |
| No passwords to leak | No credentials to manage or protect |
| Development friendly | Natural for local dev workflows |
| Zero configuration | Works out of the box |

### Limitations

- **Not for production multi-user**: This model assumes single-owner deployment
- **No remote admin**: Must be physically local to administer
- **Trust the machine**: Anyone with machine access has admin rights

## Credential Storage

### Storage Strategy

```
┌─────────────────────────────────────────┐
│            localStorage                  │
│  ┌─────────────────────────────────┐    │
│  │  admin_credentials              │    │
│  │  {                              │    │
│  │    "anthropic": {               │    │
│  │      "key": "sk-ant-...",       │    │
│  │      "endpoint": null           │    │
│  │    },                           │    │
│  │    "openai": {                  │    │
│  │      "key": "sk-...",           │    │
│  │      "endpoint": null           │    │
│  │    }                            │    │
│  │  }                              │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Security Measures

1. **Localhost-only access**: Keys can only be read on localhost
2. **Not in code**: API keys never committed to repository
3. **User-controlled**: Owner manages their own keys
4. **Clearable**: Can be wiped from browser storage

### What NOT to Do

```typescript
// ❌ NEVER hardcode API keys
const API_KEY = "sk-ant-api03-xxxxx";

// ❌ NEVER commit keys to repository
// .env files with keys

// ❌ NEVER expose keys in client bundles
const config = { apiKey: import.meta.env.VITE_API_KEY };

// ✅ DO use the credential system
const apiKey = getCredential("anthropic");
```

## API Key Best Practices

### For Developers

1. **Use the credential panel**: Store keys via Admin Settings
2. **Never share keys**: Each developer should use their own
3. **Rotate regularly**: Update keys periodically
4. **Monitor usage**: Check provider dashboards for anomalies

### For Production

When deploying beyond localhost:

1. **Use Lovable Cloud**: Proper secrets management
2. **Edge functions**: Keep keys server-side
3. **Environment variables**: Never in client code

## CORS and API Security

### Direct API Calls

⚠️ **Browser CORS Limitation**: Direct calls from browser to LLM APIs may be blocked by CORS policies.

**Current approach**: The service attempts direct calls, which works for:
- Development with CORS-disabled browsers
- APIs with permissive CORS headers

**Production approach**: Use edge functions or backend proxy.

### Recommended Architecture

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ Browser │ ──► │ Edge Func   │ ──► │  LLM API    │
│         │     │ (has key)   │     │             │
└─────────┘     └─────────────┘     └─────────────┘
```

## Common Security Pitfalls

### ❌ Anti-Patterns

| Pattern | Risk | Solution |
|---------|------|----------|
| Keys in source code | Exposed in git history | Use credential panel |
| Keys in .env committed | Leaked in repository | Add to .gitignore |
| Keys in client bundle | Visible in browser | Use server-side |
| Hardcoded admin checks | Easy to bypass | Use proper auth |
| Trust client-side roles | Privilege escalation | Verify server-side |

### ✅ Best Practices

| Practice | Benefit |
|----------|---------|
| Localhost admin detection | Physical access required |
| localStorage for keys | User-controlled, clearable |
| No keys in code | Nothing to leak in repo |
| Provider-specific credentials | Granular access control |

## Extending Security

### Adding Backend Auth

When ready for production multi-user:

1. Enable Lovable Cloud
2. Implement proper user roles table
3. Use RLS policies for data access
4. Move API keys to Cloud secrets
5. Create edge functions for API calls

### Role-Based Access (Future)

```sql
-- Example Supabase roles setup
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    role app_role not null,
    unique (user_id, role)
);
```

## Security Checklist

Before deploying:

- [ ] No API keys in source code
- [ ] No sensitive data in client bundle
- [ ] Admin features protected by isAdmin check
- [ ] localStorage cleared on logout (if applicable)
- [ ] CORS configured appropriately
- [ ] Rate limiting considered
- [ ] Error messages don't leak sensitive info
