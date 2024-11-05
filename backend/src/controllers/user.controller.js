import cookieParser from "cookie-parser";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import { Request } from "../models/request.model.js";
import { uploadToCloudinary, deleteFromCloudinary, publicId } from '../utils/cloudinary.js';
const tempUserStore = {};

// Function to generate OTP
function generateOTP(length) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Replace with your email
        pass: process.env.PASSWORD, // Replace with your email password
    },
    tls: {
        rejectUnauthorized: false // Disable strict SSL verification
    }
});

// Initiate register endpoint
const initiateRegister = asyncHandler(async (req, res) => {
    const { username, email, password, name, field } = req.body;
    if (!username || !email || !password || !name || !field) {
        throw new ApiError(400, "All fields are required");
    }

    const otp = generateOTP(4);
    tempUserStore[email] = { username, email, password, name, field, otp };

    const mailOptions = {
        from: process.env.EMAIL, // Replace with your email
        to: email,
        subject: `Hello! ${name}, It's a verification mail`,
        html: `<strong>Your OTP code is: ${otp}</strong>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json(new ApiResponse(200, email, "OTP sent successfully"));
    } catch (error) {
        throw new ApiError(500, `Error while sending OTP ${error}`);
    }
});

// Verify OTP endpoint
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        throw new ApiError(400, "All fields are required");
    }

    const tempUser = tempUserStore[email];

    if (!tempUser || tempUser.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    const { username, password, name, field } = tempUser;
    const user = await User.create({ username, email, password, name, field });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refreshToken to user document
    user.refreshToken = refreshToken;
    await user.save();

    delete tempUserStore[email];
    
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000, // 1 hour in milliseconds
        sameSite: 'none',
        domain: 'http://localhost:5173',
    });

    res.status(200).json(new ApiResponse(200, { user, accessToken , refreshToken }, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    console.log("req.body : " , req.body)

    console.log("password :",password);

    if (!identifier || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier }
        ]
      });

    if (!user) {
        throw new ApiError(400, "User doesn't exist");
    }

    const isPasswordMatch = await user.isPasswordCorrect(password);
    console.log("ispasswordmatch : ",isPasswordMatch)
    if (!isPasswordMatch) {
        throw new ApiError(400, "Wrong password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refreshToken to user document
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge:1000*60*60
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge:1000*60*60
    });

    res.status(200).json(
        new ApiResponse(
            200,
            { user, accessToken, refreshToken },
            "User login successfully"
        )
    );
});


// Controller to refresh tokens
const getRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate new tokens
        const newAccessToken = await user.generateAccessToken(user._id);
        const newRefreshToken = await user.generateRefreshToken(user._id);

        // Save new refresh token to user document
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set cookies with new tokens
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            sameSite: 'none',
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            sameSite: 'none',
        });

        res.status(200).json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Tokens refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});


const updateProfilePicture = asyncHandler(async (req, res) => {
    console.log("user")
    const userId = req.user._id;
    const file = req.file;

  
    if (!file) {
      throw new ApiError(400, 'No file uploaded');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    if (user.profilePicture) {
      const existingPublicId = await publicId(user.profilePicture);
      await deleteFromCloudinary(existingPublicId);
    }
  
    const uploadResponse = await uploadToCloudinary(file.path);
    if (!uploadResponse) {
      throw new ApiError(500, 'Failed to upload image');
    }
  
    user.profilePicture = uploadResponse.secure_url;
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Profile picture updated successfully'));
  });
  
const updateCoverImage = asyncHandler(async (req, res) => {
const userId = req.user._id;
const file = req.file;

if (!file) {
    throw new ApiError(400, 'No file uploaded');
}

const user = await User.findById(userId);

if (!user) {
    throw new ApiError(404, 'User not found');
}

if (user.coverImage) {
    const existingPublicId = await publicId(user.coverImage);
    await deleteFromCloudinary(existingPublicId);
}

const uploadResponse = await uploadToCloudinary(file.path);
if (!uploadResponse) {
    throw new ApiError(500, 'Failed to upload image');
}

user.coverImage = uploadResponse.secure_url;
await user.save();

res.status(200).json(new ApiResponse(200, user, 'Cover image updated successfully'));
});
  

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'User ID is required');
    }

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});


// Create a new request
const createRequest = async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.id; 

    console.log("from : " ,fromUserId);
    console.log("to : " ,toUserId)

    const alreadyExist = await Request.find({from : fromUserId , to:toUserId});

    console.log("alreadyExist" , alreadyExist)
    if(alreadyExist.length > 0){
      throw new ApiError(400 , "Request already exist");
    }

    const newRequest = new Request({
      from: fromUserId,
      to: toUserId,
    });
  
    await newRequest.save();
    console.log("Request created:", newRequest);
    return res.status(200).json(
        new ApiResponse(200 , newRequest , "request made successfully")
    );
  };
  

// Update request status and manage connections
const updateRequestStatus = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    console.log("r id :" , requestId)
    const { isAccepted, isRejected } = req.body;

    const request = await Request.findById(requestId)
    .populate('from', 'username email')
    .populate('to', 'username email');

    console.log("request : " , request)

    if (!request) {
        throw new ApiError(400, 'Request not found');
    }

    if (isAccepted) {
        request.isAccepted = true;
        request.isRejected = false;

        // Add connections to both users
        await User.findByIdAndUpdate(request.from._id, { $push: { connections: request.to._id } });
        await User.findByIdAndUpdate(request.to._id, { $push: { connections: request.from._id } });
        
    } else if (isRejected) {
        request.isAccepted = false;
        request.isRejected = true;
    }

    await request.save();

    await Request.findByIdAndDelete(requestId);

    res.status(200).json(new ApiResponse(200, request, 'Request status updated successfully'));
});

// Fetch all requests for the current user
const getRequests = async (req, res) => {
    const userId = req.params.id;
    console.log("userid : " ,userId)
  
    try {
      const requests = await Request.find({ to: userId , isRejected:false , isAccepted:false }).populate('from', 'username profilePicture'); // Adjust the fields as necessary
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



const getAllConnections = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate('connections'); // Adjust the fields as necessary
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user.connections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const searchUsers = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        throw new ApiError(400, 'Query parameter is required');
    }

    const users = await User.find({ username: { $regex: q, $options: 'i' } }); // Case-insensitive search

    res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

// Add education to user
const addEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { startDate, endDate, university, qualification } = req.body;
    console.log("req.body : "  ,req.body)
  
    if (!startDate || !endDate || !university || !qualification) {
      throw new ApiError(400, 'All fields are required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const newEducation = {
      startDate,
      endDate,
      university,
      qualification,
    };
  
    user.education.push(newEducation);
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Education added successfully'));
  });
  
  // Edit education of user
  const editEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { educationId, startDate, endDate, university, qualification } = req.body;

    
  
    console.log("req.body : "  ,req.body)
    if (!educationId || !startDate || !endDate || !university || !qualification) {
      throw new ApiError(400, 'All fields are required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const education = user.education.id(educationId);
  
    if (!education) {
      throw new ApiError(404, 'Education not found');
    }
  
    education.startDate = startDate;
    education.endDate = endDate;
    education.university = university;
    education.qualification = qualification;
  
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Education updated successfully'));
  });
  
  // Delete education of user
  const deleteEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { educationId } = req.body;
  
    if (!educationId) {
      throw new ApiError(400, 'Education ID is required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const education = user.education.id(educationId);
  
    if (!education) {
      throw new ApiError(404, 'Education not found');
    }
  
    education.remove();
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Education deleted successfully'));
  });
  
  // Add experience to user
  const addExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { startDate, endDate, company, position } = req.body;
    
    console.log("req.body : "  ,req.body)
  
    if (!startDate || !endDate || !company || !position) {
      throw new ApiError(400, 'All fields are required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const newExperience = {
      startDate,
      endDate,
      company,
      position,
    };
  
    user.experience.push(newExperience);
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Experience added successfully'));
  });
  
  // Edit experience of user
  const editExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { experienceId, startDate, endDate, company, position } = req.body;
  console.log("req.body : " , req.body)
    if (!experienceId || !startDate || !endDate || !company || !position) {
      throw new ApiError(400, 'All fields are required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const experience = user.experience.id(experienceId);
  
    if (!experience) {
      throw new ApiError(404, 'Experience not found');
    }
  
    experience.startDate = startDate;
    experience.endDate = endDate;
    experience.company = company;
    experience.position = position;
  
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Experience updated successfully'));
  });
  
  // Delete experience of user
  const deleteExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { experienceId } = req.body;
  
    if (!experienceId) {
      throw new ApiError(400, 'Experience ID is required');
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    const experience = user.experience.id(experienceId);
  
    if (!experience) {
      throw new ApiError(404, 'Experience not found');
    }
  
    experience.remove();
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, 'Experience deleted successfully'));
  });
  


// Get all users to whom I have sent a request
const getSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user contains the authenticated user's info

  // Find all requests where the current user is the sender
  const sentRequests = await Request.find({ from: userId })
    .populate('to', 'username email profileImage'); // Adjust fields to populate as needed

  if (!sentRequests) {
    return res.status(400).json({ message: 'No sent requests found' });
  }

  // Extract recipient user details
  const recipients = sentRequests.map(request => request.to);

  res.status(200).json({ recipients });
});


// Delete Connection
const deleteConnection = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.body;
  if (!userId1 || !userId2) {
      throw new ApiError(400, "Both user IDs are required");
  }

  const user1 = await User.findById(userId1);
  const user2 = await User.findById(userId2);

  if (!user1 || !user2) {
      throw new ApiError(404, "User not found");
  }

  user1.connections = user1.connections.filter(conn => conn.toString() !== userId2);
  user2.connections = user2.connections.filter(conn => conn.toString() !== userId1);

  await user1.save();
  await user2.save();

  res.status(200).json(new ApiResponse(200, null, "Connection deleted"));
});



const getuser = asyncHandler(async(req,res)=>{
  const user = req.user;
  if(!user){
    throw new ApiError(400 , "Not authenticated");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      user,
      "User fetched successfully"
    )
  )
})

  

  
export {
    initiateRegister,
    login,
    verifyOtp,
    getRefreshToken,
    updateProfilePicture,
    updateCoverImage,
    getUserById ,
    createRequest ,
    updateRequestStatus,
    getAllConnections,
    getRequests,
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
    // Export the new function
};
