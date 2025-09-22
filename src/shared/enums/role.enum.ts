export const RoleEnum = {
  SUPER_ADMIN: 'SuperAdmin',
  MANAGER: 'Manager',
  SALE: 'Sale'
} as const;

export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];
