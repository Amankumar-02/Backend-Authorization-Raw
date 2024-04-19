import { Router } from "express";
import {loginDashbord, registerDashbord, profileDashbord, userRegister, userLogin, userLogout, findAll, deleteUser} from '../controllers/user.controller.js';
import { verifyJWT, isLoggedOut } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

// login route with a loggedOut Middleware
userRouter.get("/", isLoggedOut, loginDashbord);
// register route with a loggedOut Middleware
userRouter.get("/register", isLoggedOut, registerDashbord);
// profile route with loggedIn Middleware
userRouter.get("/profile", verifyJWT, profileDashbord)


// userRegister call route
userRouter.post("/userregister", userRegister);
// userLogin call route
userRouter.post("/userlogin", userLogin);
// userLogout call route
userRouter.get("/userlogout", verifyJWT, userLogout);


userRouter.get("/find", verifyJWT, findAll);
userRouter.post("/delete", deleteUser);