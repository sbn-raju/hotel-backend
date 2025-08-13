//This function will generate the random OTP.
const generateOneTimePassword = async()=>{
    return Math.floor(100000 + Math.random() * 900000);
}


module.exports = generateOneTimePassword;