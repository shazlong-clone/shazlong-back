const getPagination = (data, total, page, size) => {
  const totalPages = Math.ceil(total / size);
  const currentPage = page;
  const skip = (page - 1) * size;
  return { total, currentPage, totalPages, skip, data, limit: size };
};

module.exports = getPagination;
