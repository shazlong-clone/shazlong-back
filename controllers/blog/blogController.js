const Blog = require('../../models/blogModel');
const catchAsync = require('../../utils/catchAsync');

exports.createBlog = catchAsync(async (req, res, next) => {
  const params = req.body;
  const blogs = await Blog.create(params);
  res.status(200).json({
    status: true,
    data: {
      results: blogs
    }
  });
});

exports.getBlogById = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate({
    path: 'publisher',
    select: 'photo fullArName fullEnName'
  });
  res.status(200).json({
    status: true,
    data: {
      results: blog
    }
  });
});
