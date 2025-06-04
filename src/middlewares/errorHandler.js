const handleValidationErrors = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message
    }));

    return res.status(400).json({
      success: false,
      errors
    });
  }

  // Pass to the next middleware if not a validation error
  next(err);
};

module.exports = { handleValidationErrors };