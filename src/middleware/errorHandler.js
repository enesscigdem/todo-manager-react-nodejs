// Central error handler
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
};
