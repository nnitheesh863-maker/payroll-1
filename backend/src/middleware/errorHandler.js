export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    detail: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
