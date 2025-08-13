const jwt = require('jsonwebtoken');

//This fucntion will generate the Refresh token.
const generateRefreshToken = async(userData)=>{

    //Returning the access token created from the userData.
    return jwt.sign(userData, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: '1d'
    });
}


module.exports = generateRefreshToken;