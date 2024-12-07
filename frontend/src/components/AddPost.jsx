import React, { useState, useRef } from 'react';
import { UploadIcon, PencilIcon } from '@heroicons/react/outline';
import axiosInstance from '../axiosConfig/axiosConfig'; // Adjust the import path based on your project structure

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddPost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  const navigate  = useNavigate();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
      setIsEditing(false);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('content', textContent);
    formData.append('tags', ''); // Add tags if needed
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axiosInstance.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if(response.data){
        toast.success("Posts uploaded successfully");
        navigate("/dashboard")
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 bg-[#111826] min-h-screen w-full text-white">
      <h2 className="text-3xl font-semibold mb-8 text-center">Add a Post</h2>
      <div className="flex flex-col items-center">
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
          id="imageUpload"
        />
        {!imagePreview ? (
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
              <UploadIcon className="h-24 w-24 text-gray-400 mb-2" />
              <span className="text-blue-500">Upload Image</span>
            </label>
          </div>
        ) : (
          <div className="relative mb-4">
            <img src={imagePreview} alt="Selected" className="w-48 h-48 object-cover" />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 p-2 bg-gray-700 text-white rounded-full"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        {isEditing && !imagePreview && (
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
              <UploadIcon className="h-24 w-24 text-gray-400 mb-2" />
              <span className="text-blue-500">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
                id="imageUpload"
              />
            </label>
          </div>
        )}
        <textarea
          placeholder="Write your text content here..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded mb-4 bg-transparent text-white"
          maxLength={500}
        />
        <button
          onClick={handlePost}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default AddPost;
