import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../services/auth.service.js';

export const isSuperAdmin = (user) => user && user.role === ROLES.ADMIN;
export const canManageUsers = (user) => isSuperAdmin(user);
export const canApproveHR = (user) => isSuperAdmin(user);
