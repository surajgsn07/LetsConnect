import React, { useEffect, useState } from 'react';
import PostComponent from './PostComponent';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useSelector } from 'react-redux';
import { BiLoaderAlt } from 'react-icons/bi'; // Import loader icon

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loader
  const user = useSelector(state => state.auth.user);
  const [reloadS, setReloadS] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true); // Show loader
    try {
      const res = await axiosInstance('/posts');
      if (res.data) {
        console.log('res : ', res);
        setPosts(res.data.data);
      }
    } catch (error) {
      console.log('error : ', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const reload = () => {
    setReloadS(!reloadS);
  };

  useEffect(() => {
    fetchPosts();
  }, [reloadS]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-7">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <BiLoaderAlt className="text-4xl animate-spin text-gray-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 font-semibold">
          No posts available. Be the first to post something!
        </div>
      ) : (
        posts.map((post) => (
          <PostComponent
            key={post?._id}
            profilePic={post?.author?.profilePicture}
            name={post.author?.username}
            profession={post?.author?.field}
            content={post?.content}
            image={post.media}
            likes={post.likes}
            comments={post.comments}
            postId={post._id}
            userId={user._id}
            reload={reload}
          />
        ))
      )}
    </div>
  );
};

export default PostList;
