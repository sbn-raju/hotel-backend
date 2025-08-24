const express = require("express");
const { generateOrderControllers, getStatusPaymentControllers, getOrdersControllers } = require("../controllers/payment.controllers");
const { paymentVerificationControllers } = require("../webhooks/razorpay/verifyPayment.webhook");



const paymentRoutes = express();


paymentRoutes.route("/get-order").post(generateOrderControllers);


paymentRoutes.route("/status/verify-payment").get(getStatusPaymentControllers);


paymentRoutes.route('/fetch').get(getOrdersControllers);

//Webhook.
paymentRoutes.route('/v1/webhook/status-payment').post(paymentVerificationControllers);


module.exports = paymentRoutes