const { createOrders } = require("../services/razorpay.services.js");
const Room = require("../models/Rooms.models.js");
const getNumberOfDays = require("../helper/countDays.helper.js");
const Orders = require("../models/Order.models.js");
const { attachementMail } = require("../services/email.services.js");
const invoiceTemplate = require('../templates/invoice.templates.js');
const htmlToPdf = require("../helper/converter-html-pdf.js");
const path = require("path");



//This controller will make the order.
const generateOrderControllers = async(req, res)=>{

    //Getting the details from the body.
    const { name, email, room_id, user_id, check_in, check_out, phone, guests, rooms}  = req.body;
    
    //Validation check.
    if(!name || !email || !room_id || !user_id || !check_in || !check_out){
        return res.status(400).json({
            success: false,
            message: "Insufficient information"
        });
    }

    //Getting the room_id and the price of the room.
    try {
        //Creating the room construct.
        const room = await Room.findById(room_id);
        
        //Getting the price of the room per night.
        const price = room?.room_price;

        //Counting the number of the days between the check_in and the check_out.
        const numberOfDays = getNumberOfDays(check_in, check_out);

        //finding the totalAmount.
        console.log(numberOfDays, price);
        const totalAmount = numberOfDays * price;

        console.log(totalAmount);

        //Calculating cgst and sgst.
        const cgst = (totalAmount * 9) / 100;
        const sgst = (totalAmount * 9) / 100;
        
        console.log(cgst, sgst);

        //Creating the recipt id.
        const receiptId = `rcpt_${Date.now()}`;

        //This is the finalAmount from the user
        const finalAmount = totalAmount + sgst + cgst;

        //Making the order.
        const option = {
            amount: parseInt(finalAmount.toFixed(2))  * 100, // Razorpay expects amount in paisa
            currency: "INR",
            receipt: receiptId,
            notes:[
                {
                  userName: name,
                  userEmail: email,
                  checkOut: check_out,
                  checkIn: check_in,
                  roomId: room_id,
                  guests: guests,
                  mobileNo: phone,
                  rooms: rooms
                }
            ]
        }

        //Creating the razorpay order.
        const newOrder = await createOrders(option);
        console.log(newOrder);

        const newOrderEntry = new Orders({
            order_id: newOrder?.id,
            order_response: newOrder,
            user_id: user_id,
            number_of_rooms: rooms,
            status: newOrder?.status === "created" ? "pending" : "pending"
        });


        //Saving the data into the db.
        const result = await newOrderEntry.save();
        console.log(result);

        //Trigger the email that your order has been created.
        const html = invoiceTemplate(result);
        const pdfPath = path.join(__dirname, `../invoices/invoice~${result._id}.pdf`);
        console.log(pdfPath, html);

        await htmlToPdf(html, pdfPath);
        await attachementMail(result?.order_response?.notes[0]?.userEmail, "Your Invoice", "Attached in your attached", pdfPath);


        if(result){
            return res.status(201).json({
                success: true,
                data: newOrder
            });
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


//This is the API which will verify the user payment.
const getStatusPaymentControllers = async(req, res)=>{

 //Getting the order details of the particaular id.
  const orderId = req?.query?.order_id;

  //Validation id
  if(!orderId){
    return res.status(200).json({
      success: false,
      message: "Order Id is not present"
    });
  }

 
  try {
    const orderStatus = await Orders.findOne({order_id: orderId});

    if(!orderStatus){
        return res.status(400).json({
            success: false,
            message: "Order Id not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: orderStatus
    });


  } catch (error) {
    console.error("Error in creating payment order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
}


const getOrdersControllers = async (req, res) => {
  try {
    // Pagination defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Optional filter: status
    const status = req.query.status; // 'pending' | 'failed' | 'success'
    const filter = {};

    if (status) {
      filter.status = status;
    }

    // Fetch orders with filter, skip, limit, and populate user details if needed
    const orders = await Orders.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .populate('user_id', 'name email'); // Optional: populate user info (adjust fields as needed)

    // Get total count for pagination
    const total = await Orders.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};


module.exports = {
    generateOrderControllers,
    getStatusPaymentControllers,
    getOrdersControllers
}
 