function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: statusCode === 500 ? "Internal server error" : err.message,
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    payload.debug = err.message;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;
