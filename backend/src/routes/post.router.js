import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost
} from '../controllers/post.controller.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

// Routes for managing posts
router.post('/create', verifyJwt, upload.single('image'), createPost);
router.get('/', getAllPosts); // Get all posts
router.get('/:postId', getPostById); // Get a specific post by ID
router.put('/update/:postId', verifyJwt, updatePost); // Update a post
router.delete('/delete/:postId', verifyJwt, deletePost); // Delete a post

// Routes for liking and unliking posts
router.post('/like/:postId', verifyJwt, likePost); // Like a post
router.post('/unlike/:postId', verifyJwt, unlikePost); // Unlike a post

export default router;
