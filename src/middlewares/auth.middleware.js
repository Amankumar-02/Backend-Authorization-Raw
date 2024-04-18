import jwt from 'jsonwebtoken';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import  {ApiError}  from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

export const verifyJWT = AsyncHandler(async(req, res, next)=>{
    try {
        // take accessToken from cookies
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            res.status(401)
            // .json(new ApiError(401, "Unauthorized request"))
            .redirect('/')
        } else {
            // check the token is match or not
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

            // here _id is get/match from the userModel
            const authUser = await User.findById(decodedToken?._id).select('-password');

            if (!authUser) {
                res.status(401).json(new ApiError(401, "Invalid access token"))
            };
            req.user = authUser;
            next();
        }
    } catch (error) {
        res.status(401).json(new ApiError(401, "Invalid access token"));
    };
});

export const isLoggedOut = AsyncHandler(async(req, res, next)=>{
    try {
        // take accessToken from cookies
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            // if cookies not found then do register/login
            next();
        } else {
            // check the token is match or not
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if(decodedToken){
                res.redirect('/profile');
            }
        }
    } catch (error) {
        res.status(401).json(new ApiError(401, "Invalid access token"));
    };
});