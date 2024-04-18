import { Router } from "express";
import {userRegister, userLogin, userLogout, findAll, deleteUser} from '../controllers/user.controller.js';
import { verifyJWT, isLoggedOut } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

// login route with a loggedOut Middleware
userRouter.get("/", isLoggedOut, (req, res)=>{
    // res.send("Hello World")
    const alert = req.flash("errorAlert");
    res.render("login", { errorAlert: alert? alert[0] : "" });
});
// register route with a loggedOut Middleware
userRouter.get("/register", isLoggedOut, (req, res)=>{
    const alert = req.flash("errorAlert");
    res.render("register", { errorAlert: alert? alert[0] : "" });
});
// profile route with loggedIn Middleware
userRouter.get("/profile", verifyJWT, (req, res)=>{
    res.render("profile");
})


// userRegister call route
userRouter.post("/userregister", userRegister);
// userLogin call route
userRouter.post("/userlogin", userLogin);
// userLogout call route
userRouter.get("/userlogout", verifyJWT, userLogout);


userRouter.get("/find", findAll);
userRouter.post("/delete", deleteUser);