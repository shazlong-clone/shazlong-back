const Blog = require('../../models/blogModel');
const catchAsync = require('../../utils/catchAsync');
const APIFeature = require('../../utils/apiFeatures');
const getPagination = require('../../utils/getPagination');
// const resizeBuffer = require('../../utils/resizeBuffer');
const { PENDING, ACCEPTED } = require('../../utils/constants');

exports.createBlog = catchAsync(async (req, res) => {
  req.body.publisher = req.user._id;
  req.body.status = PENDING;
  req.body.isFeatured = false;
  if (req.body.id) {
    await Blog.updateOne({ _id: req.body.id }, req.body);
  }else {
    await Blog.create(req.body);
  }
  res.status(200).json({
    status: true
  });
});

exports.getBlogById = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate({
    path: 'publisher',
    select: 'photo fullArName fullEnName'
  });
  if (blog) {
    blog.numOfReader += 1;
    await blog.save();
  }
  res.status(200).json({
    status: true,
    result: blog
  });
});
exports.getBlogs = catchAsync(async (req, res, next) => {
  const {
    name,
    category,
    isFeatured,
    page,
    size,
    fields,
    sort = '-createdAt'
  } = req.query;
  let blogQuery = Blog.find({ status: ACCEPTED, isDeleted: false });
  if (name) {
    blogQuery = blogQuery.find({
      $or: [
        {
          title: {
            $regex: `.*${name}.*`
          }
        },
        {
          body: {
            $regex: `.*${name}.*`
          }
        }
      ]
    });
  }

  if (category) {
    blogQuery = blogQuery.find({
      category: {
        $in: category.split(',')
      }
    });
  }
  if (isFeatured) {
    blogQuery = blogQuery.find({
      isFeatured: Boolean(isFeatured)
    });
  }
  const featured = new APIFeature(blogQuery, {
    page,
    size,
    sort,
    fields
  })
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const total = await Blog.countDocuments(featured.excutedQyery);

  const blogs = await featured.query.populate({
    path: 'publisher',
    select: 'fullArName fullEnName _id photo'
  });
  const result = getPagination(blogs, total, featured.page, featured.size);

  res.status(200).json({
    status: true,
    result
  });
});

exports.getDoctorBlogs = catchAsync(async (req, res, next) => {
  const blogQuery = Blog.find();
  req.query.publisher = req.user._id;
  req.query.isDeleted = false;
  const featured = new APIFeature(blogQuery, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const blogs = await featured.query.populate({
    path: 'publisher',
    select: 'fullArName fullEnName _id photo'
  });
  const total = await Blog.countDocuments(featured.excutedQyery);
  const data = getPagination(blogs, total, featured.page, featured.size);

  res.status(200).json({
    status: true,
    data
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.updateMany(
    {
      _id: {
        $in: req.query.ids.split(',') || []
      }
    },
    {
      isDeleted: true
    }
  );

  res.status(200).json({
    status: true
  });
});
