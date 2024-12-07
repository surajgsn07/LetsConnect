import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import { login } from '../store/authSlice';


const renderLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);


const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ type: '', item: {} });
  const [connections, setconnections] = useState([]);
  const [field, setfield] = useState("")
  const [formData, setFormData] = useState({});
  const user = useSelector(state => state.auth.user);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      setisLoading(true);
      try {
        const res = await axiosInstance(`/users/getuserbyid/${user?._id}`);
        if (res && res.data) {
          const { profilePicture, coverImage, experience, education, connections, field } = res.data.data;
          setProfilePic(profilePicture);
          setCoverImage(coverImage);
          setExperience(experience);
          setEducation(education);
          setconnections(connections);
          setfield(field)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }finally{
        setisLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleChangeProfilePic = async (event) => {
    setisLoading(true);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      console.log(formData)
      
      
      try {
        const res = await axiosInstance.post(`/users/profile-picture`, {profilePicture:file}, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        dispatch(login({user:res.data.data}))
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }finally{
        setisLoading(false);
      }
    }
  };

  const handleChangeCoverImage = async (event) => {
    setisLoading(true);
    const file = event.target.files[0];
    if (file) {
      


      try {
        const res = await axiosInstance.post(`/users/cover-image`, {coverImage:file}, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        dispatch(login({user:res.data.data}))
      } catch (error) {
        console.error('Error updating cover image:', error);
      }finally{
        setisLoading(false);
      }
    }
  };

  const handleEdit = (item, type) => {
    setIsEditing(true);
    setCurrentEdit({ item, type });
    setFormData({
      [type === 'experience' ? 'position' : 'qualification']: item[type === 'experience' ? 'position' : 'qualification'],
      institution: item[type === 'experience' ? 'company' : 'university'],
      startDate: new Date(item.startDate).toISOString().substring(0, 10),
      endDate: new Date(item.endDate).toISOString().substring(0, 10)
    });
  };



  const handleAdd = (type) => {
    setIsAdding(true);
    setCurrentEdit({ type });
    setFormData({
      [type === 'experience' ? 'position' : 'qualification']: '',
      institution: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { type, item } = currentEdit;
    const newData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    try {
      if (type === 'experience') {
        newData.company = formData.institution;
        if (item && item._id) {
          await axiosInstance.put(`/users/experience`, {...newData , experienceId : item._id});
          setExperience((prev) => prev.map((exp) => (exp._id === item._id ? { ...exp, ...newData } : exp)));
        } else {
          const res = await axiosInstance.post(`/users/experience`, newData);
          setExperience((prev) => [...prev, res.data]);
        }
      } else {
        newData.university = formData.institution;
        if (item && item._id) {
          await axiosInstance.put(`/users/education`, {...newData , educationId:item._id});
          setEducation((prev) => prev.map((edu) => (edu._id === item._id ? { ...edu, ...newData } : edu)));
        } else {
          const res = await axiosInstance.post(`/users/education`, newData);
          setEducation((prev) => [...prev, res.data]);
        }
      }
      setIsEditing(false);
      setIsAdding(false);
      setCurrentEdit({ type: '', item: {} });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setProfilePic(user?.profilePicture);
    setCoverImage(user?.coverImage);
    setExperience(user?.experience);
    setEducation(user?.education);
    setconnections(user?.connections);
    setfield(user?.field);
    
  }, [user])
  

  const renderSection = (data = [], type) => (
    data.length > 0 ? (
      data.map((item) => (
        <div key={item._id} className="relative p-6 bg-gray-900 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">{type === 'experience' ? item.position : item.qualification}</h3>
          <p className="mt-2">{type === 'experience' ? item.company : item.university}</p>
          <p className="mt-2">{`From ${new Date(item.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} to ${new Date(item.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}</p>
          <button
            className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-gray-900 hover:bg-gray-600 text-white focus:outline-none"
            onClick={() => handleEdit(item, type)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      ))
    ) : (
      <p className="text-center w-full text-gray-500">
        {type === 'experience' ? 'No experience' : 'No education'}
      </p>
    )
  );

  if(isLoading){
    return Loader();
  }

  return (
    <div className="relative pb-8 text-white min-h-screen bg-gradient-to-b from-gray-800 to-black">
      {/* Cover Image */}
      <div className="relative">
        <img className="w-full h-64 object-cover" src={coverImage || 'https://example.com/default-cover.jpg'} alt="Cover" />
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeCoverImage}
          className="hidden"
          id="coverImageInput"
        />
        <label htmlFor="coverImageInput" className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none cursor-pointer">
          <FontAwesomeIcon icon={faCamera} />
        </label>
      </div>

      {/* Profile Picture */}
      <div className="absolute top-48 left-1/2 transform -translate-x-1/2 -translate-y-16">
        <img
          className="w-40 h-40 object-cover rounded-full border-4 border-white"
          src={profilePic || 'https://example.com/default-profile.jpg'}
          alt="Profile"
        />
        <input
          type="file"
          accept="image/*"
          name='profilePic'
          onChange={handleChangeProfilePic}
          className="absolute hidden bottom-0 right-0 mb-2 mr-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none cursor-pointer"
          id="profilePicInput"
        />
        <label htmlFor="profilePicInput" className="absolute bottom-0 right-0 mb-2 mr-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none cursor-pointer">
          <FontAwesomeIcon icon={faCamera} />
        </label>
      </div>

      {/* User's Name */}
      <div className="mt-16 text-center space-y-2 flex flex-col gap-5">
        <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'User Name'}</h1>
        <h2 className="text-lg md:text-xl font-semibold">
          <span className='border bg-blue-950 p-2 rounded-xl my-2'>{field || 'Web Developer'}</span>
        </h2>
        <h2 className="text-lg md:text-xl font-semibold"> {connections.length} connections </h2>
      </div>

      {/* Experience Section */}
      <div className="mt-8 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold">Experience</h2>
          <button
            className="p-2 rounded-full bg-gray-900 hover:bg-gray-600 text-white focus:outline-none"
            onClick={() => handleAdd('experience')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {renderSection(experience, 'experience')}
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-8 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold">Education</h2>
          <button
            className="p-2 rounded-full bg-gray-900 hover:bg-gray-600 text-white focus:outline-none"
            onClick={() => handleAdd('education')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {renderSection(education, 'education')}
        </div>
      </div>

      {/* Form for editing/adding experience or education */}
      {(isEditing || isAdding) && (
        <div className="fixed z-50 text-white w-full inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <form className="bg-gray-900 w-[90%] sm:w-[70%] p-6 rounded-lg shadow-lg text-white" onSubmit={handleSave}>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit' : 'Add'} {currentEdit.type === 'experience' ? 'Experience' : 'Education'}</h2>
            <div className="mb-4">
              <label htmlFor="positionOrQualification" className="block mb-2 font-medium">{currentEdit.type === 'experience' ? 'Position' : 'Qualification'}</label>
              <input
                type="text"
                id="positionOrQualification"
                name={currentEdit.type === 'experience' ? 'position' : 'qualification'}
                value={formData[currentEdit.type === 'experience' ? 'position' : 'qualification'] || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black "
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="institution" className="block mb-2 font-medium">{currentEdit.type === 'experience' ? 'Company' : 'University'}</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startDate" className="block mb-2 font-medium">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endDate" className="block mb-2 font-medium">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setCurrentEdit({ type: '', item: {} });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
