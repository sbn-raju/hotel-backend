const options = {
    httpOnly: true,     // prevents JavaScript access (recommended)
    secure: process.env.ENVIRONMENT === 'prod' ? true : false,       // only over HTTPS
    sameSite: "None",    // CSRF protection 
}

module.exports = options;