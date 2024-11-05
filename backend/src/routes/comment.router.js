import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
} from '../controllers/comment.controller.js';

const router = Router();

// Routes for managing comments
router.post('/create', verifyJwt, createComment); // Create a new comment
router.get('/post/:postId', getCommentsByPost); // Get all comments for a specific post
router.put('/update/:commentId', verifyJwt, updateComment); // Update a comment
router.delete('/delete/:commentId', verifyJwt, deleteComment); // Delete a comment

// Routes for liking and unliking comments
router.post('/like/:commentId', verifyJwt, likeComment); // Like a comment
router.post('/unlike/:commentId', verifyJwt, unlikeComment); // Unlike a comment

export default router;
