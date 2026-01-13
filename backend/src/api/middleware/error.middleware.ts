import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors';
import { logger } from '../../config/logger';
import { errorResponse } from '../../utils/response';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  if (error instanceof AppError) {
    errorResponse(res, error.message, error.statusCode, error.code || 'ERROR');
    return;
  }

  // Default to 500 server error
  errorResponse(res, 'Internal server error', 500, 'INTERNAL_ERROR');
}

export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  errorResponse(res, `Route ${req.url} not found`, 404, 'NOT_FOUND');
}
