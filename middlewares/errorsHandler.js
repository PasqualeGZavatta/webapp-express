function errorsHandler(err, req, res, next) {
  res.status(500).json({
    err: err.message,
  });
}

export default errorsHandler;
