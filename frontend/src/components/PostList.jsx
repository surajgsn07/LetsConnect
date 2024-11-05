import React, { useEffect, useState } from 'react';
import PostComponent from './PostComponent';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useSelector } from 'react-redux';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const user = useSelector(state => state.auth.user);
  const [reloadS, setReloadS] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance("/posts");
      if (res.data) {
        console.log("res : ", res);
        setPosts(res.data.data);
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const reload = () => {
    setReloadS(!reloadS);
  };

  useEffect(() => {
    fetchPosts();
  }, [reloadS]);

  return (
    <div className='w-full flex flex-col gap-7'>
      {posts.map((post) => (
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
      ))}
    </div>
  );
};

export default PostList;
