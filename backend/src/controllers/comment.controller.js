import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createComment = asyncHandler(async (req, res) => {
    const { author, post, content } = req.body;
    console.log("res.body: ", req.body);

    if (!author || !post || !content) {
        throw new ApiError(400, "All fields are required");
    }

    const newComment = new Comment({ author, post, content });

    try {
        const savedComment = await newComment.save();
        

        res.status(201).json(new ApiResponse(201, savedComment, "Comment created successfully"));
    } catch (error) {
        throw new ApiError(500, `Error creating comment: ${error.message}`);
    }
});


// Get all comments for a post
const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    

    try {
        const comments = await Comment.find({ post: postId })
            .populate('author', 'username') // Include author info
            .populate('post', 'title'); // Include post info

        res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, `Error retrieving comments: ${error.message}`);
    }
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const updates = req.body;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, { new: true });

        if (!updatedComment) {
            throw new ApiError(404, "Comment not found");
        }

        res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
    } catch (error) {
        throw new ApiError(500, `Error updating comment: ${error.message}`);
    }
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            throw new ApiError(404, "Comment not found");
        }

        res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
    } catch (error) {
        throw new ApiError(500, `Error deleting comment: ${error.message}`);
    }
});

// Like a comment
const likeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    

    if (!commentId || !userId) {
        throw new ApiError(400, "Comment ID and User ID are required");
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }

        if (comment.likes.includes(userId)) {
            throw new ApiError(400, "User already liked this comment");
        }

        comment.likes.push(userId);
        await comment.save();

        res.status(200).json(new ApiResponse(200, comment, "Comment liked successfully"));
    } catch (error) {
        throw new ApiError(500, `Error liking comment: ${error.message}`);
    }
});

// Unlike a comment
const unlikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!commentId || !userId) {
        throw new ApiError(400, "Comment ID and User ID are required");
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }

        if (!comment.likes.includes(userId)) {
            throw new ApiError(400, "User has not liked this comment");
        }

        comment.likes = comment.likes.filter(id => id.toString() !== userId);
        await comment.save();

        res.status(200).json(new ApiResponse(200, comment, "Comment unliked successfully"));
    } catch (error) {
        throw new ApiError(500, `Error unliking comment: ${error.message}`);
    }
});

export {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
};
