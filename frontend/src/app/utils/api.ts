export function getDeterministicUUID(str: string): string {
  const normalized = str.trim().toLowerCase();
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < normalized.length; i++) {
    ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const bytes: number[] = [];
  let seed = (h1 ^ h2) >>> 0;
  for (let i = 0; i < 16; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    bytes.push(seed & 0xFF);
  }
  
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}

export function getStoredUserId(): string {
  // 1. Try to extract the user ID from the standard Supabase Auth session token
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || '{}');
        if (parsed.user?.id) {
          return parsed.user.id;
        }
      } catch (e) {
        console.error('Error parsing Supabase user ID:', e);
      }
    }
  }

  // 2. Fallback to custom stored user ID or generate a mock one
  let userId = window.localStorage.getItem('synapse_user_id');
  if (!userId) {
    userId = window.crypto.randomUUID();
    window.localStorage.setItem('synapse_user_id', userId);
  }
  return userId;
}

export function getStoredToken(): string | null {
  const synapseToken = window.localStorage.getItem('synapse_auth_token');
  if (synapseToken) return synapseToken;

  // Supabase client stores token details under a sb-[project-id]-auth-token key
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || '{}');
        if (parsed.currentSession?.access_token) {
          return parsed.currentSession.access_token;
        }
      } catch (e) {
        console.error('Error parsing Supabase session token:', e);
      }
    }
  }
  return null;
}

export function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let finalInput = input;
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  if (apiBaseUrl) {
    const cleanBaseUrl = apiBaseUrl.replace(/\/$/, '');
    if (typeof input === 'string' && input.startsWith('/')) {
      finalInput = `${cleanBaseUrl}${input}`;
    } else if (input instanceof URL && input.pathname.startsWith('/')) {
      finalInput = new URL(input.pathname + input.search + input.hash, cleanBaseUrl);
    }
  }

  return fetch(finalInput, {
    ...init,
    headers,
  });
}
