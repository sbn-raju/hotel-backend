const razorpay = require("../config/razorpay.config.js");



//Creating the order for the payment.
const createOrders = async(options)=>{

    return new Promise((resolve, reject) => {
    razorpay.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Order Error:", error);
        return reject(error);
      }
      return resolve(order);
    });
  });
}


module.exports = {
    createOrders
}