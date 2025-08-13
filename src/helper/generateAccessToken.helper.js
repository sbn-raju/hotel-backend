const jwt = require('jsonwebtoken');

//This fucntion will generate the Access token.
const generateAccessToken = async(userData)=>{

    //Returning the access token created from the userData.
    return jwt.sign(userData, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '15m'
    });
}


module.exports = generateAccessToken;