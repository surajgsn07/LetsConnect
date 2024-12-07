import Message from '../models/message.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Send a new message
const sendMessage = asyncHandler(async (req, res) => {
    const { receiver, content, fileType, fileUrl } = req.body;
    const sender = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!receiver || !content || !fileType || !fileUrl) {
        throw new ApiError(400, "All fields are required");
    }

    const newMessage = new Message({
        sender,
        receiver,
        content,
        fileType,
        fileUrl
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(new ApiResponse(201, savedMessage, "Message sent successfully"));
    } catch (error) {
        throw new ApiError(500, `Error sending message: ${error.message}`);
    }
});

// Get messages between two users
const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const sender = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver: userId },
                { sender: userId, receiver: sender }
            ]
        }).sort();

        res.status(200).json(new ApiResponse(200, messages, "Messages retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, `Error retrieving messages: ${error.message}`);
    }
});

// Delete a message
const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and stored in req.user

    if (!messageId) {
        throw new ApiError(400, "Message ID is required");
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            throw new ApiError(404, "Message not found");
        }

        // Ensure the user is either the sender or receiver
        if (message.sender.toString() !== userId.toString() && message.receiver.toString() !== userId.toString()) {
            throw new ApiError(403, "Unauthorized to delete this message");
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
    } catch (error) {
        throw new ApiError(500, `Error deleting message: ${error.message}`);
    }
});
const getUsersWithLastMessage = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated and stored in req.user

    try {
        const usersWithLastMessage = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', userId] }, // If the sender is the authenticated user
                            '$receiver', // Group by the receiver (opposite user)
                            '$sender' // Otherwise, group by the sender (opposite user)
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            },
            {
                $project: {
                    lastMessage: {
                        content: '$lastMessage.content',
                        fileType: '$lastMessage.fileType',
                        fileUrl: '$lastMessage.fileUrl',
                        createdAt: '$lastMessage.createdAt',
                        sender: '$lastMessage.sender',
                        receiver: '$lastMessage.receiver'
                    }
                }
            }
        ]);

        // Fetch user details for each message
        const usersWithDetails = await Promise.all(usersWithLastMessage.map(async (msg) => {
            let user;
            if (msg.lastMessage.sender.toString() === userId.toString()) {
                user = await User.findById(msg.lastMessage.receiver);
            } else {
                user = await User.findById(msg.lastMessage.sender);
            }
            return {
                ...msg,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                }
            };
        }));

        

        res.status(200).json(new ApiResponse(200, usersWithDetails, "Users with last messages retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, `Error retrieving users with last messages: ${error.message}`);
    }
});




export {
    sendMessage,
    getMessages,
    deleteMessage,
    getUsersWithLastMessage
};
