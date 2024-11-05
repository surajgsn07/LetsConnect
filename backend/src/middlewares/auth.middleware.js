import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async( req , res, next)=>{
    try {
        
        const token =  req.header("Authorization")?.replace("Bearer " , "") || req.body.token || req.body.headers?.Authorization?.replace("Bearer " , "") || req.cookies.accessToken ;

        
        
        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        console.log({token})
        console.log(process.env.ACCESS_TOKEN_SECRET)
    
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log({decodedToken})


        const user = await User.findById(decodedToken._id).select("-password -refreshToken");


        console.log(user)
    
        if(!user){
            throw new ApiError(401, "Invalid token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})