const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


//Creating the Configuration of the mailer.
const config = {
    secure:true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
}



//Creating the transporter using the nodemailer.
const transporter = nodemailer.createTransport(config)


//Creating the mail function which will send the mail according to the need.
const sendMail = async(email)=>{
  
   try {
     const mailOptions = {
         from: process.env.EMAIL,
         to: email,
         subject: 'Test Email',
         text: 'Hello, this is a test email sent from a Node.js application!',
     };
    
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             return console.log(error);
         }
         console.log('Email sent: ' + info.response);
     });
   } catch (error) {
    console.log(error);
   }
}


//Authentication Mail.
const authMail = async(email, subject, context)=>{
    try {
     const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: context,
     };
    
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            return console.log(error);
         }
        console.log('Email sent successfully: ' + info.response);
     });
   } catch (error) {
        console.log(error);
        //When scaling this application please re-push the email into dead-letter queue
   }
}

//This mail will be sending to the person who have done the successfull booking.
const attachementMail = async(email, subject, html, path)=>{

    //Getting the email of the user.
     try {
     const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        context: html,
        attachments: [
            {
                filename: `invoice~${email}-${Date.now()}.pdf`,
                path: path
            },
        ],
     };
    
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            return console.log(error);
         }

         if(info){
            console.log(`Email with the attachement is sent successfully to the following email-id: ${email}`, info.response);
         }
     });
   } catch (error) {
        console.log("This is the error in the mail", error);
        throw new Error(error);
   }

}


module.exports = {
    sendMail,
    authMail,
    attachementMail
}