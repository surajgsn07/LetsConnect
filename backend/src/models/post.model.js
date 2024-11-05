
import mongoose,{Schema} from "mongoose";

// Define Post schema
const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media: {
        type: String, // Assuming media URLs for simplicity
        required: false
    },
    tags: [{
        type: String,
        required: false
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create Post model
const Post = mongoose.model('Post', postSchema);

// module.exports = Post;
export {
    Post
}

