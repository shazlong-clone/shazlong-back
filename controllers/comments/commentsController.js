const Comment = require("../../models/commentsModel");
const User = require("../../models/userModel");
const APIFeatures = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const getPagination = require("../../utils/getPagination");

exports.createComment = catchAsync(async (req, res, next) => {
    const { text, date, replyTo } = req.body;
    const blog = req.params.blogId;
    const auther = req.user._id;
    const comment = await Comment.create({
        text, blog, date, auther
    });
    if (comment._id && replyTo) {
        const replyToComment = await Comment.findById(replyTo);
        replyToComment.replies.push(comment._id);
        await replyToComment.save();
        comment.replyTo = replyTo;
        await comment.save()
    }
    const autherData = await User.findById({ _id: auther }).select('name photo');

    comment.auther = autherData;


    res.status(200).json({
        status: true,
        comment
    });
});

exports.getBlogComments = catchAsync(async (req, res, next) => {
    const { blogId } = req.params;
    const { page, size } = req.query;
    const query = Comment.find({ blog: blogId, replyTo: null }).populate({ path: 'auther', select: 'name photo' });
    const featured = new APIFeatures(query, { page, size, sort: '-date' }).filter().sort().paginate();
    const total = await Comment.countDocuments(featured.excutedQyery);
    const comments = await featured.query;
    const result = getPagination(comments, total, featured.page, featured.size);

    res.status(200).json({
        status: true,
        result
    });

});

exports.editComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = await Comment.findOneAndUpdate({ _id: id }, { text }, {
        new: true
    });

    res.status(200).json({
        status: true,
        comment
    });
});

exports.getCommentReplies = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comments = await Comment.find({ replyTo: id }).populate({ path: 'auther', select: 'name photo' }).sort({ date: -1 });

    res.status(200).json({
        status: true,
        result: comments
    });
});
