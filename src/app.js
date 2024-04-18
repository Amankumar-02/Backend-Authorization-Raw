import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';

export const app = express();
export const port = 3000;

app.set("view engine", "ejs")

app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

import {userRouter} from './routers/user.route.js';

app.use('/', userRouter);