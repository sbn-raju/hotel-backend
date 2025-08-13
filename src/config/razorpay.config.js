const Razorpay = require('razorpay');


//Creating instance of the razorpay.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_CLIENT_ID,
    key_secret: process.env.RAZORPAY_CLIENT_SECRET
});


module.exports = razorpay