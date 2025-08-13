const User = require('../models/User.models.js');
const generateAccessToken = require('../helper/generateAccessToken.helper.js');
const generateRefreshToken = require('../helper/generateRefreshToken.helper.js');
const options = require('../utils/cookieOptions.utils.js');
const jwt = require("jsonwebtoken");
const { authMail } = require('../services/email.services.js');

//This is the login Controllers.
const authLoginController = async(req, res)=>{

    //Getting all the inputs from the body.
    const { email, password } = req.body;
    
    //Validation check.
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    //Check if the use already exist.
    const user = await User.findOne({
        email: email
    }) 

    if(!user){
        return res.status(400).json({
            success: false,
            message: "No user found"
        })
    }

    //Comparing the password.
    if(user.password != password){
        return res.status(400).json({
            success: false,
            message: "Incorrect password"
        })
    }

    //Creating the user data to store in the token.
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    //Creating the access adn refresh token
    const accessToken = await generateAccessToken(userData);
    const refreshToken = await generateRefreshToken(userData);

    //Adding the refresh token in the database.
    const userRefreshToken = await User.updateOne({
        refreshToken: refreshToken
    });

    
    
    //Setting the cookies.
    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    //Returning the response.
    return res.status(200).json({
        success: true,
        message: "User login successfully",
    })
}  



//This controller is for getting the user how is logged in.
const getUserControllers = async(req, res)=>{

    //Getting the user details from the middleware.
    const userDetails = req.user;
    console.log("User Details : ", userDetails);

    return res.status(200).json({
        success: true,
        data: userDetails
    })
}


//This controller will issue the access token 
//**NOTE**:Do not put the authentication middleware infront of this controller.
const refreshTokenControllers = async(req, res)=>{

    //Getting the refresh token.
    const refreshToken = req?.cookies?.refreshToken;


    //Validation check.
    if(!refreshToken){
        return res.status(401).json({
            success: false,
            message: "Refresh token is missing"
        });
    }

    //Verifying the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, async(error, result)=>{
        if(error){
            return res.status(403).json({
                success: false,
                message: "Invalid or expired refresh token"
            })
        }

        //User details destructuring the result.
        const userDetails = {
            id: result?.id,
            name: result?.name,
            email: result?.email,
            profile: result?.profile,
            role: result?.role,
        }

        //Generating the access token.
        const accessToken = await generateAccessToken(userDetails);

        //Setting up the new access token.
        res.cookie("accessToken", accessToken, options);

        //Returning the response.
        return res.status(200).json({ 
            succes: false,
            message: "Access token refreshed" 
        });
    })

}


//This controller is goggle callback controller.
const authGoogleCallBackController = async(req, res)=>{
    
    //Getting the access and refresh token.
    const {accessToken, refreshToken} = req.user;
    console.log(req.user);

    //Setting the cookies.
    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    //Redirecting the user to the payment page.
    console.log("This is the call back fun" , accessToken, refreshToken);
    return res.redirect(`https://hotel-frontend-three-khaki.vercel.app/room/checkout`);
}



module.exports = {
    authLoginController,
    getUserControllers,
    refreshTokenControllers,
    authGoogleCallBackController
}