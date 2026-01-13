import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../../auth/jwt';
import { AuthenticationError, AuthorizationError } from '../../utils/errors';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError();
      }

      if (!allowedRoles.includes(req.user.role as UserRole)) {
        throw new AuthorizationError();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
