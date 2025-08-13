const express = require("express");
const { generateOrderControllers, getStatusPaymentControllers, getOrdersControllers } = require("../controllers/payment.controllers");



const paymentRoutes = express();


paymentRoutes.route("/get-order").post(generateOrderControllers);


paymentRoutes.route("/status/verify-payment").get(getStatusPaymentControllers);


paymentRoutes.route('/fetch').get(getOrdersControllers);


module.exports = paymentRoutes