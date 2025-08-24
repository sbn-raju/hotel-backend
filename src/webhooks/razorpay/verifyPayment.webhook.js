const crypto = require("crypto");
const Orders = require("../../models/Order.models.js"); // Make sure the model name matches

const paymentVerificationControllers = async (req, res) => {
//   console.log(req); // You may want to remove this in production

  const body = await req.text();
  const signature = req.headers.get("x-signature-razorpay");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });
  }

  const event = JSON.parse(body);

  try {
    if (event?.event === "payment.captured") {
      const paymentId = event.payload?.payment?.entity?.id;
      const orderId = event.payload?.payment?.entity?.order_id;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID not found in webhook payload",
        });
      }

      // Update the order status to 'success'
      await Orders.findOneAndUpdate(
        { order_id: orderId },
        {
          status: "success",
          payment_response: event, // Save the full event as order_response
        }
      );

      return res.status(200).json({
        success: true,
        message: "Order status updated to success",
      });
    } else if (event?.event === "payment.failed") {
      const orderId = event.payload?.payment?.entity?.order_id;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID not found in webhook payload",
        });
      }

      // Update the order status to 'failed'
      await Orders.findOneAndUpdate(
        { order_id: orderId },
        {
          status: "failed",
          payment_response: event,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Order status updated to failed",
      });
    }
  } catch (error) {
    console.log("Webhook failed!!")
    return res.status(500).json({
      error: "Webhook failed",
    });
  }
};

module.exports = {
  paymentVerificationControllers,
};
