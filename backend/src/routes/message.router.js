import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    sendMessage,
    getMessages,
    deleteMessage,
    getUsersWithLastMessage
} from '../controllers/message.controller.js';

const router = Router();

// Routes for managing messages
router.post('/send', verifyJwt, sendMessage); // Send a new message
router.get('/conversation/:userId', verifyJwt, getMessages); // Get messages between two users
router.delete('/delete/:messageId', verifyJwt, deleteMessage); // Delete a message
router.get('/users-with-last-message', verifyJwt, getUsersWithLastMessage); // Get users with whom the user has exchanged messages and the last message

export default router;
