class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.excutedQyery = {};
    this.page = 1;
    this.size = 10;
    this.skip = 0;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'size', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // parsing will remove undefined fileds
    console.log(this.query);
    this.query = this.query.find(JSON.parse(queryStr));
    this.excutedQyery = this.query.clone();

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    this.page = this.queryString.page * 1 || 1;
    this.size = this.queryString.size * 1 || 10;
    this.skip = (this.page - 1) * this.size;
    this.query = this.query.skip(this.skip).limit(this.size);
    return this;
  }
}
module.exports = APIFeatures;
