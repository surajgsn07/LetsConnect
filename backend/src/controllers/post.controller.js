import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { uploadToCloudinary, deleteFromCloudinary, publicId } from '../utils/cloudinary.js';
// Create a new post
const createPost = asyncHandler(async (req, res) => {
    const { content, tags } = req.body;
    const author = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Upload the image to Cloudinary if provided
    let media = null;
    if (req.file) {
        try {
            const uploadResponse = await uploadToCloudinary(req.file.path);
            media = uploadResponse.secure_url;
        } catch (error) {
            throw new ApiError(500, `Error uploading image: ${error.message}`);
        }
    }

    const newPost = new Post({
        author,
        content,
        media, // Save the Cloudinary URL
        tags
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(new ApiResponse(201, savedPost, "Post created successfully"));
    } catch (error) {
        throw new ApiError(500, `Error creating post: ${error.message}`);
    }
});

// Get all posts
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        let posts = await Post.find()
        .populate({
            path: 'author',
            select: 'username profilePicture field'
        }) // Include author info
        .sort({ createdAt: -1 }); // Sort by most recent posts


        
        posts = await Promise.all(posts.map(async (post) => {
            const comments = await Comment.find({ post: post._id }).populate("author");
            post = post.toObject(); // Convert Mongoose document to plain JavaScript object
            post.comments = comments;
            return post;
        }));


        res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, `Error retrieving posts: ${error.message}`);
    }
});

// Get a specific post by ID
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    try {
        const post = await Post.findById(postId)
            .populate('author', 'username')
            .populate('comments');

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        res.status(200).json(new ApiResponse(200, post, "Post retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, `Error retrieving post: ${error.message}`);
    }
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const updates = req.body;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true });

        if (!updatedPost) {
            throw new ApiError(404, "Post not found");
        }

        res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
    } catch (error) {
        throw new ApiError(500, `Error updating post: ${error.message}`);
    }
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            throw new ApiError(404, "Post not found");
        }

        res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
    } catch (error) {
        throw new ApiError(500, `Error deleting post: ${error.message}`);
    }
});

// Like a post
const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (post.likes.includes(userId)) {
            throw new ApiError(400, "Post already liked by this user");
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json(new ApiResponse(200, post, "Post liked successfully"));
    } catch (error) {
        throw new ApiError(500, `Error liking post: ${error.message}`);
    }
});

// Unlike a post
const unlikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (!post.likes.includes(userId)) {
            throw new ApiError(400, "Post not liked by this user");
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        res.status(200).json(new ApiResponse(200, post, "Post unliked successfully"));
    } catch (error) {
        throw new ApiError(500, `Error unliking post: ${error.message}`);
    }
});

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost
};
