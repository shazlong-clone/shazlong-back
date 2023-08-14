const filterObj = (obj, ...excluededFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (!excluededFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = filterObj
