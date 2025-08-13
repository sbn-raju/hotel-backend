const mongoose = require('mongoose');


//Creating the user schema.
let roomImagesSchema = new mongoose.Schema({
    roomType : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true, 
    },
    roomImages: {
        type: [String],
        required: true
    }

},{
    timestamps: true
});


//Exporting the userschema to the database. (Populating the database with the user collection).
const RoomImages = mongoose.model('RoomImages', roomImagesSchema);

module.exports = RoomImages;