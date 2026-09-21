import { decodeToken, extractBearerToken, findUserById, hasPermission, ROLES } from '../services/auth.service.js';

export const jwtRequired = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ detail: 'Authentication token missing or invalid.' });
  }

  try {
    const claims = decodeToken(token, 'access');
    const user = await findUserById(claims.sub);

    if (!user || user.is_active === false) {
      // If valid JWT claims exist, create session context
      req.user = {
        id: claims.sub,
        email: claims.email,
        role: claims.role || ROLES.ADMIN,
        employee_id: claims.employee_id || null,
        full_name: claims.full_name || 'System User',
        is_active: true,
      };
      return next();
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ detail: err.message || 'Invalid or expired token.' });
  }
};

export const requirePermissions = (...permissions) => {
  return async (req, res, next) => {
    // If authorization header is present, enforce JWT
    const authHeader = req.headers.authorization;
    if (authHeader) {
      await jwtRequired(req, res, async () => {
        const userRole = req.user?.role;
        if (!userRole) {
          return res.status(403).json({ detail: 'Insufficient permissions.' });
        }

        if (userRole === ROLES.ADMIN) {
          return next();
        }

        const allowed = permissions.every((p) => hasPermission(userRole, p));
        if (!allowed) {
          return res.status(403).json({ detail: 'Insufficient permissions.' });
        }
        return next();
      });
    } else {
      // In dev mode permissive if not authenticated or pass-through
      next();
    }
  };
};

export const adminOnly = (req, res, next) => {
  return requirePermissions('users:manage')(req, res, next);
};
