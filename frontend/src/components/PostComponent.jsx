import React, { useState, useEffect } from 'react';
import { FaComment, FaThumbsUp, FaTrash } from 'react-icons/fa';
import axiosInstance from '../axiosConfig/axiosConfig'; // Adjust the import path based on your project structure

const PostComponent = ({ profilePic = "", name = "", profession = "", image = "", comments = [], content = "", likes = [], postId, userId, reload }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);

  useEffect(() => {
    setIsLiked(likes.includes(userId));
  }, [likes, userId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const response = await axiosInstance.post(`/comments/create`, {
        author: userId || "hlo",
        content: newComment,
        post: postId,
      });
      if (response.data.success) {
        setNewComment('');
        reload();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comments/delete/${commentId}`);
      if (response.data.success) {
        reload();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const comment = comments.find(comment => comment._id === commentId);
      const isCommentLiked = comment.likes.includes(userId);
      const response = isCommentLiked
        ? await axiosInstance.post(`/comments/unlike/${commentId}`, { userId })
        : await axiosInstance.post(`/comments/like/${commentId}`, { userId });
      if (response.data.success) {
        reload();
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = isLiked
        ? await axiosInstance.post(`/posts/unlike/${postId}`, { userId })
        : await axiosInstance.post(`/posts/like/${postId}`, { userId });
      if (response.data.success) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        reload();
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  return (
    <div className="w-[90%] md:w-[80%] mx-auto p-4 bg-gray-900 text-white shadow-md rounded-lg flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className={`flex-1 p-4 ${showComments ? 'hidden lg:block' : 'block'}`}>
        <div className="flex items-center space-x-4">
          <img src={profilePic} alt={name} className="w-16 h-16 rounded-full" />
          <div>
            <div className="text-xl font-bold">{name}</div>
            <div className="text-sm text-gray-600">{profession}</div>
          </div>
        </div>
        <div className="mt-4">
          {content && (
            <div className={`mb-4 text-lg ${!showMoreContent ? 'max-h-20 overflow-hidden' : ''}`}>
              {content.slice(0, 100)}
              {!showMoreContent ? content.length > 100 && (
                <button onClick={() => setShowMoreContent(true)} className="text-blue-500 ml-1">
                  Read More
                </button>
              ) : <>{content.slice(100)}</>}
            </div>
          )}
          {image && (
            <div className="max-h-60 w-full overflow-hidden">
              <img src={image} alt="Post content" className="w-full h-full rounded-lg object-cover" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${isLiked ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <FaThumbsUp />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-600 lg:hidden"
          >
            <FaComment />
            <span>Comment</span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className={`flex-1 p-4 ${showComments ? 'block' : 'hidden lg:block'}`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto mb-4" style={{ maxHeight: '400px' }}>
            {comments.length > 0 ? comments.map((comment) => (
              <div key={comment._id} className="mb-2 p-4 bg-gray-100 rounded-lg flex items-start space-x-4">
                <img src={comment.author.profilePicture} alt={comment.author.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-black">{comment.author.name}</div>
                      <div className="text-xs text-gray-500">{new Date(comment.updatedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center space-x-1 ${comment.likes.includes(userId) ? 'text-blue-500' : 'text-gray-600'}`}
                      >
                        <FaThumbsUp />
                        <span>{comment.likes.length}</span>
                      </button>
                      {comment.author._id === userId && (
                        <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-black">{comment.content}</div>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-center mt-4">No comments</div>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              className="flex-1 p-2 border border-gray-300 text-black rounded-l-lg"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-blue-500 text-white rounded-r-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Button to toggle sections on small screens */}
      <div className="lg:hidden mt-4">
        {!showComments ? (
          <button
            onClick={() => setShowComments(true)}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Show Comments
          </button>
        ) : (
          <button
            onClick={() => setShowComments(false)}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Show Post
          </button>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
