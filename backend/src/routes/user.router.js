import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    getUserById,
    initiateRegister,
    login,
    verifyOtp,
    updateProfilePicture,
    updateCoverImage,
    createRequest,
    updateRequestStatus,
    getRequests,
    getAllConnections,
    searchUsers,
    addEducation,
    editEducation,
    deleteEducation,
    addExperience,
    editExperience,
    deleteExperience,
    getSentRequests,
    deleteConnection,
    getuser
} from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.js";

const router = Router();

router.route('/initiateRegister').post(initiateRegister);
router.route('/verifyOtp').post(verifyOtp);
router.route('/login').post(login);

// Routes for updating profile picture and cover image
router.post('/profile-picture', verifyJwt, upload.single('profilePicture'), updateProfilePicture);
router.post('/cover-image', verifyJwt, upload.single('coverImage'), updateCoverImage);

// Routes for managing friend requests
router.post('/createRequest/:id', verifyJwt, createRequest); // Send a friend request
router.patch('/friend-request/update/:requestId', verifyJwt, updateRequestStatus); // Update request status
router.get('/friend-requests/:id', verifyJwt, getRequests); // Get all friend requests for the user

// Route to get a user by their ID
router.get("/getuserbyid/:id", getUserById);
router.get("/getuser" ,verifyJwt, getuser)

// Route to get all connections of a user by their ID
router.get('/connections/:userId', verifyJwt, getAllConnections); // Fetch connections
router.post("/deleteConnection" , deleteConnection)
// Route to search for users by username
router.get('/search', searchUsers);

// Routes for managing education
router.post('/education', verifyJwt, addEducation); // Add education
router.put('/education', verifyJwt, editEducation); // Edit education
router.delete('/education', verifyJwt, deleteEducation); // Delete education

// Routes for managing experience
router.post('/experience', verifyJwt, addExperience); // Add experience
router.put('/experience', verifyJwt, editExperience); // Edit experience
router.delete('/experience', verifyJwt, deleteExperience); // Delete experience
router.get("/sent-requests" , verifyJwt , getSentRequests)
export default router;
