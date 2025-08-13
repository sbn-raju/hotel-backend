const options = {
    httpOnly: true,     // prevents JavaScript access (recommended)
    secure: process.env.ENVIRONMENT === 'prod' ? true : false,       // only over HTTPS
    sameSite: "lax",    // CSRF protection 
}

module.exports = options;