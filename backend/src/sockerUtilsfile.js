import { User } from "./models/user.model.js";
import  Message  from "./models/message.model.js";

const isConnection = async (userId1, userId2) => {
    try {
        const user1 = await User.findById(userId1).select('connections');
        if (!user1) {
            throw new Error("User not found");
        }
        const isConnection = user1.connections.includes(userId2);
        return isConnection;
    } catch (error) {
        console.error("Error checking connection:", error);
        return false;
    }
};

const sendMessage = async (sender, receiver, content, fileUrl) => {
    try {
        const newMessage = new Message({
            sender,
            receiver,
            content,
            fileUrl
        });

        const savedMessage = await newMessage.save();
        return savedMessage ? true : false;
    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
};

export { isConnection, sendMessage };
