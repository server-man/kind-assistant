# Admin System

## Overview

The admin system uses **localhost detection** as the primary mechanism for confirming ownership and granting admin access. This approach eliminates the need for backend authentication while maintaining security.

## How It Works

### Localhost Detection

The `useLocalhost` hook checks if the application is running on a local development server:

```typescript
// src/hooks/useLocalhost.ts
export const useLocalhost = () => {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocal = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname === '::1';
    
    setIsLocalhost(isLocal);
  }, []);

  return { isLocalhost };
};
```

### Admin Context

The `AdminContext` provides admin state throughout the application:

```typescript
interface AdminContextType {
  isAdmin: boolean;      // Has admin access
  isOwner: boolean;      // Is the project owner
  isDeveloper: boolean;  // Has developer permissions
  credentials: ApiCredentials[];
  addCredential: (name: string, key: string, endpoint?: string) => void;
  removeCredential: (name: string) => void;
  getCredential: (name: string) => string | null;
}
```

## Admin Features

### 1. Admin Badge

Displays role badges when on localhost:

- **Owner**: Full access to all features
- **Admin**: Can manage credentials and AI config
- **Dev**: Development-only features

### 2. Credentials Panel

Secure management of API keys:

- Add new credentials with optional endpoints
- View existing credentials (keys hidden)
- Remove credentials
- Keys stored in localStorage (localhost-only)

### 3. AI Configuration Panel

Configure AI behavior:

- Select LLM provider (Anthropic, OpenAI, Custom)
- Choose specific model
- Set custom system prompt
- Adjust temperature parameter

## Security Considerations

### Why Localhost-Based Auth?

1. **No Backend Required**: Works without server infrastructure
2. **Physical Access**: Only someone with machine access can be admin
3. **Development Friendly**: Natural for local development workflows
4. **Zero Configuration**: No passwords or tokens to manage

### Limitations

- Not suitable for multi-user production deployments
- Requires running locally for admin access
- No remote admin capabilities

### Best Practices

1. **Never expose admin routes publicly** - Admin features should always check `isAdmin`
2. **Store sensitive data carefully** - API keys are in localStorage, only accessible locally
3. **Validate on every render** - The `isLocalhost` check runs on mount

## Extending the Admin System

### Adding New Admin Features

1. Create component in `src/components/admin/`
2. Wrap with admin check:

```typescript
import { useAdmin } from "@/contexts/AdminContext";

export const MyAdminFeature = () => {
  const { isAdmin } = useAdmin();
  
  if (!isAdmin) return null;
  
  return <div>Admin-only content</div>;
};
```

3. Add to `AdminSettingsSheet` if it's a settings feature

### Adding New Credential Types

Credentials are generic key-value pairs with optional endpoints:

```typescript
addCredential("my-service", "api-key-value", "https://api.example.com");
```

Retrieve in your service:

```typescript
const apiKey = getCredential("my-service");
```

## Troubleshooting

### Admin Features Not Showing

1. Check you're running on `localhost` or `127.0.0.1`
2. Verify the port doesn't affect detection
3. Check browser console for errors

### Credentials Not Persisting

1. Ensure localStorage is available
2. Check for private browsing mode
3. Verify you're on localhost when saving

### Settings Not Loading

1. Check localStorage for `admin_credentials` key
2. Verify JSON format is valid
3. Clear and re-add credentials if corrupted
