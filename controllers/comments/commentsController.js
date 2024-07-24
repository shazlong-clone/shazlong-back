const Comment = require("../../models/commentsModel");
const catchAsync = require("../../utils/catchAsync");

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
    res.status(200).json({
        status: true
    });
});

exports.getBlogComments = catchAsync(async (req, res, next) => {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId, replyTo: null });

    res.status(200).json({
        status: true,
        data: comments
    });
});
