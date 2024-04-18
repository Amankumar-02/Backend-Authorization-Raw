import {User} from '../models/user.model.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';

const generateAccessToken = async(userId)=>{
    try {
        const userData = await User.findById(userId);
        // generating tokens for registered users
        const accessToken = userData.generateAccessToken();
        // save tokens to db
        return accessToken;
    } catch (error) {
        res.status(500).json(new ApiError(500, "Something went wrong while generating access token."))
    }
};

export const userRegister = AsyncHandler(async(req, res)=>{
    const {username, email, fullname, password} = req.body;
    if(!(username && email && fullname && password)){
        // res.status(400).json(new ApiError(400, "All Fields are required"));
        req.flash("errorAlert", "All Fields are required");
        return res.redirect("/register");
    };
    if(!email.includes("@")){
        // res.status(400).json(new ApiError(400, "Email is invalid"));
        req.flash("errorAlert", "Email is invalid");
        return res.redirect("/register");
    };
    if(username.includes(" ") || email.includes(" ")){
        // res.status(400).json(new ApiError(400, "remove spaces in username and email"));
        req.flash("errorAlert", "remove spaces in username and email");
        return res.redirect("/register");
    };
    if(email !== email.toLowerCase() || username !== username.toLowerCase()){
        // res.status(400).json(new ApiError(400, "only lowerCase is allowed in username and email"));
        req.flash("errorAlert", "only lowerCase is allowed in username and email");
        return res.redirect("/register");
    };
    if(password.length<8){
        // res.status(400).json(new ApiError(400, "Password length must be above 8 digits"));
        req.flash("errorAlert", "Password length must be above 8 digits");
        return res.redirect("/register");
    };
    const exists = await User.findOne({$or: [{username}, {email}]});
    if(exists){
        // res.status(400).json(new ApiError(400, "Username or email is already exists"));
        req.flash("errorAlert", "Username or email is already exists");
        return res.redirect("/register");
    };
    const createData = await User.create({
        username,
        email,
        fullname,
        password
    });
    // only register code
    // const printData = await User.findById(createData._id).select("-password");
    // if(!printData){
    //     res.status(500).json(new ApiError(500, "Something went wrong while registering the user."));
    // };
    const accessToken = await generateAccessToken(createData._id);
    const loggedInUser = await User.findById(createData._id).select("-password");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    // .json(new ApiResponse(200, {user: loggedInUser, accessToken}, "User created and logged in Successfully"))
    .redirect("/profile");
});

export const userLogin = AsyncHandler(async(req, res)=>{
    const {email_username, password} = req.body;
    if(!(email_username && password)){
        // res.status(400).json(new ApiError(400, "All fields are required"));
        req.flash("errorAlert", "All fields are required");
        return res.redirect("/");
    };
    const dbUser = await User.findOne({
        $or: [{ email : email_username }, { username : email_username }]
    });
    if(!dbUser){
        // res.status(404).json(new ApiError(404, "User doesnot exist."));
        req.flash("errorAlert", "User doesnot exist.");
        return res.redirect("/");
    }else{
        const checkPassword = await dbUser.isPasswordCorrect(password);
    if(!checkPassword){
        // res.status(401).json(new ApiError(401, "Invalid user credentials"));
        req.flash("errorAlert", "Invalid user credentials");
        return res.redirect("/");
    };
    const accessToken = await generateAccessToken(dbUser._id);
    const loggedInUser = await User.findById(dbUser._id).select("-password");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    // .json(new ApiResponse(200, {user: loggedInUser, accessToken}, "User Logged in Successfully"))
    .redirect("/profile");
    }
});

export const userLogout = AsyncHandler(async(req, res)=>{
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    return res
    .status(200)
    .clearCookie("accessToken", options)
    // .json(new ApiResponse(200, {}, "User Logged Out successfully"))
    .redirect("/");
});

export const findAll = AsyncHandler(async(req, res)=>{
    const user = await User.find().select("-password");
    return res.status(200).json(new ApiResponse(200, user, "All Users"));
});

export const deleteUser = AsyncHandler(async(req, res)=>{
    const {username_email} = req.body;
    const user = await User.findOneAndDelete({
        $or: [{
            username: username_email},
            {email : username_email,
        }]
    }).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "User is removed SuccessFully"));
});
