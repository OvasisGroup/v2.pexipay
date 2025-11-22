type UserRole = 'ADMIN' | 'SUPER_MERCHANT' | 'MERCHANT' | 'KYC_REVIEWER' | 'FRAUD_ANALYST';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'users:read',
    'users:write',
    'merchants:read',
    'merchants:write',
    'super-merchants:read',
    'super-merchants:write',
    'transactions:read',
    'transactions:write',
    'kyc:read',
    'kyc:write',
    'kyc:approve',
    'fraud:read',
    'fraud:write',
    'settlements:read',
    'settlements:write',
    'api-keys:read',
    'api-keys:write',
    'audit-logs:read',
  ],
  SUPER_MERCHANT: [
    'merchants:read',
    'merchants:write',
    'transactions:read',
    'kyc:read',
    'settlements:read',
    'api-keys:read',
    'api-keys:write',
  ],
  MERCHANT: [
    'transactions:read',
    'transactions:write',
    'kyc:read',
    'settlements:read',
    'api-keys:read',
  ],
  KYC_REVIEWER: [
    'kyc:read',
    'kyc:write',
    'kyc:approve',
    'merchants:read',
    'super-merchants:read',
  ],
  FRAUD_ANALYST: [
    'fraud:read',
    'fraud:write',
    'transactions:read',
    'merchants:read',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

export function canAccessResource(
  role: UserRole,
  resource: string,
  action: 'read' | 'write'
): boolean {
  return hasPermission(role, `${resource}:${action}`);
}
