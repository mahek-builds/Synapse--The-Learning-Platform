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
