// Role-Based Access Control utilities

export type Role = 'founder' | 'admin' | 'support' | 'bookings' | 'marketing';

export interface Permission {
  resource: string;
  actions: ('read' | 'create' | 'update' | 'delete')[];
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  founder: [
    { resource: '*', actions: ['read', 'create', 'update', 'delete'] }
  ],
  admin: [
    { resource: 'destinations', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'packages', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'offers', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'testimonials', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'leads', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'bookings', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'invoices', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  support: [
    { resource: 'leads', actions: ['read', 'create', 'update'] },
    { resource: 'lead_activities', actions: ['read', 'create'] },
    { resource: 'bookings', actions: ['read'] },
  ],
  bookings: [
    { resource: 'leads', actions: ['read'] },
    { resource: 'bookings', actions: ['read', 'create', 'update'] },
    { resource: 'invoices', actions: ['read', 'create', 'update'] },
  ],
  marketing: [
    { resource: 'offers', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'ad_placements', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'leads', actions: ['read'] },
  ],
};

export function hasPermission(role: Role, resource: string, action: 'read' | 'create' | 'update' | 'delete'): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  // Check for wildcard permission (founder)
  const wildcardPerm = permissions.find(p => p.resource === '*');
  if (wildcardPerm) return true;

  // Check for specific resource permission
  const resourcePerm = permissions.find(p => p.resource === resource);
  if (!resourcePerm) return false;

  return resourcePerm.actions.includes(action);
}

export function requirePermission(role: Role, resource: string, action: 'read' | 'create' | 'update' | 'delete') {
  if (!hasPermission(role, resource, action)) {
    throw new Error(`Permission denied: ${role} cannot ${action} ${resource}`);
  }
}
