exports.getPaginate = (pageNum, size) => {
  const page = pageNum * 1 || 1;
  const limit = size * 1 || 30;
  const skip = (page - 1) * limit;
  return { limit, skip };
};

exports.getPagingData = (data, page, limit) => {
  const { total: totalItems, data: result } = data;
  page = page || 0;
  // eslint-disable-next-line radix
  const currentPage = parseInt(page === 0 ? 1 : page);
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, totalPages, currentPage, result };
};
