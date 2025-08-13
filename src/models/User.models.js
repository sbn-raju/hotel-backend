const mongoose = require('mongoose');


//Creating the user schema.
let userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    authProvider: {
        type: String,
        enum: ['google', 'local', 'aadhar', 'phone'],
        default: 'local'
    },
    profile: {
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,        
    },
    password:{
        type: String,
    },
    phone:{
        type: Number,
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        enum: ["male", "female", "others"],
        default: 'male'
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    },
    refreshToken: {
        type: String,
    },
    oneTimePassword: {
        type: Number,
        minlength: 6,
        maxlength: 6
    },
    aadhar_no: {
        type: Number,
        minlength: 12,
        maxlength: 12
    },
    is_verified_through:{
        type: String,
        default: 'email',
        enum: ['email', 'phone', 'aadhar', 'goggle'],
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    }},
    {
        timestamps: true
    }
);


//Exporting the userschema to the database. (Populating the database with the user collection).
const User = mongoose.model('User', userSchema);

module.exports = User;