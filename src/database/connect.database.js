//pass// devHotelReservation
//username //hotelreservation
const mongoose = require('mongoose');

//This function will connect the server with the database.
const connectDb = async()=>{
    //Calling the connect functions.
    await mongoose.connect(`${process.env.MONGODB_URL}`).then(() =>{
        console.log('Connected to database successfully');
    }).catch((error) =>{
        console.log(`Error in connecting the database ${error}`);
    });

}


module.exports = connectDb;
