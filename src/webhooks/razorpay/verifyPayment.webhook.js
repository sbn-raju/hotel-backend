const { db } = require("../../database/db.connect.js");
const crypto  = require("crypto");


//Getting the databse from the error.
const paymentVerificationControllers = async(req, res) =>{
    console.log(req);

    //Getting the webhook from the razorpay.
    const body = await req.text();
    const signature = req.headers.get("x-signature-razorpay");


    const expectedSignature  = crypto
                                .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
                                .update(body)
                                .digest('hex');

    if(expectedSignature !== signature){
       return res.status(400).json({
        success: false,
        message: "Invalid Signature"
       }); 
    }

    const event = JSON.parse(body);

    try {
        if(event?.event === "payment.captured"){

            //We have to change the status of the order from pending to completed here.
            const updatePaymentStatusQuery = "UPDATE orders SET status_order = ?, status_payment = ? WHERE order_id = ?";
            const updatePaymentStatusValue = [event?.payload?.payment?.entity?.status, event?.payload?.payment?.entity?.status, event?.payload?.payment?.entity?.order_id];

            //Db Querying to change the status of the payment from pending to captured.
            db.query(updatePaymentStatusQuery, updatePaymentStatusValue, (error, result)=>{
                if(error){
                    throw new Error(error);
                }

                if(result.length != 0){
                    //Can send in the invoice as well.
                    return res.status(200).json({
                        success : true,
                        received: true
                    });
                }
            })
            
        
        }else if(event?.event === "payment.failed"){

            //We have to change the status of the order from pending to completed here.
            const updatePaymentStatusQuery = "UPDATE orders SET status_order = ?, status_payment = ? WHERE order_id = ?";
            const updatePaymentStatusValue = [event?.payload?.payment?.entity?.status, event?.payload?.payment?.entity?.status, event?.payload?.payment?.entity?.order_id];

            //Db Querying to change the status of the payment from pending to captured.
            db.query(updatePaymentStatusQuery, updatePaymentStatusValue, (error, result)=>{
                if(error){
                    throw new Error(error);
                }

                if(result.length != 0){
                    //Can send in the invoice as well.
                    return res.status(200).json({
                        success : true,
                        received: true
                    });
                }
            });

            
        }
    } catch (error) {
        return res.status(500).json({ 
            error: "Webhook failed"
         });
    }
}


module.exports = {
    paymentVerificationControllers
}