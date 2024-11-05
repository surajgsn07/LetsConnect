import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: {
        type: String,  // For text messages
        required: true,
    },
    fileType: {  // Type of file (e.g., 'image', 'video', 'document')
        type: String,
        default:"image"
    },
    fileUrl: {  // URL or path to the file
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
