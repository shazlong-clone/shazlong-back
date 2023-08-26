const getPaginate = (pageNum, size) => {
  const page = pageNum * 1 || 1;
  const limit = size * 1 || 100;
  const skip = (page - 1) * limit;
  return { limit, skip };
};

module.exports = getPaginate;
