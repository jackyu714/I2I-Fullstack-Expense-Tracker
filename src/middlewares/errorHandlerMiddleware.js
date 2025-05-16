const handleErrors = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  // Determine the status code
  const statusCode = err.status || 500;

  // Construct the error response
  const errorResponse = {
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  };

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

module.exports = handleErrors;