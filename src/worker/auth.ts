// Cloudflare Access authentication utilities

export interface CloudflareAccessUser {
  email: string;
  authenticated: boolean;
  name?: string;
  groups?: string[];
}

// Email allowlist for admin roles
const ADMIN_EMAILS = [
  'founder@novelsphere.com',
  'admin@novelsphere.com',
];

const STAFF_EMAILS = [
  'support@novelsphere.com',
  'bookings@novelsphere.com',
  'marketing@novelsphere.com',
];

export function parseCloudflareAccessHeaders(request: Request): CloudflareAccessUser | null {
  // Cloudflare Access injects these headers when authentication succeeds
  const email = request.headers.get('cf-access-authenticated-user-email');
  
  if (!email) {
    return null;
  }

  return {
    email: email || '',
    authenticated: true,
    name: email?.split('@')[0] || '',
  };
}

export function getUserRole(email: string): 'admin' | 'staff' | null {
  const normalizedEmail = email.toLowerCase();
  
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return 'admin';
  }
  
  if (STAFF_EMAILS.includes(normalizedEmail) || normalizedEmail.endsWith('@novelsphere.com')) {
    return 'staff';
  }
  
  return null;
}

export function isAuthorized(email: string): boolean {
  return getUserRole(email) !== null;
}
