const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the comment schema with recursive replies
const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    auther: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;