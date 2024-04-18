import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username:String,
    email:String,
    fullname:String,
    password:String,
}, {timestamps:true});

// before user create encrypt the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){return next()};
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    // compare the db and client password
    isPasswordCorrect : async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    // access token generator using jwt
    generateAccessToken: function(){
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    },
};

export const User = mongoose.model("user", userSchema);