/**
 * Centralized Express Error Handling Middleware
 */

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API endpoint "${req.method} ${req.originalUrl}" does not exist.`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
