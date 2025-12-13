module.exports = function paginate(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        model.find().skip(skip).limit(limit),
        model.countDocuments()
      ]);

      res.pagination = {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        data
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};
