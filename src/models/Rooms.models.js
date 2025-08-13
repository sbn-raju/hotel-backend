const mongoose = require('mongoose');


//Creating the user schema.
let roomSchema = new mongoose.Schema({
    room_type: {
        type: String,
        required: true,
    },
    room_facilities:{
        room_bed_count :{
            type: Number,
            required: true,
            default: 1
        },
        room_ac :{
            type: String,
            required: true,
            enum: ["non-ac", "ac"],
            default: "non-ac"
        },
        room_hotWater: {
            type: Boolean,
            required: true,
            default: false,
        },
        room_minibar: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    room_food:{
       breakfast: {
            type: String,
            required: true,
            enum: ['included', 'not-included'],
            default: 'not-included'
       },
        lunch: {
            type: String,
            required: true,
            enum: ['included', 'not-included'],
            default: 'not-included'
       },   
        dinner: {
            type: String,
            required: true,
            enum: ['included', 'not-included'],
            default: 'not-included'
       }          
    },
    room_images_metadata:{
        type: [Object],
        required: true
    },
    room_price:{
        type: Number,
        required: true,
    },
    cgst:{
        type: Number,
    },
    sgst:{
        type: Number
    }

},{
    timestamps: true
});


//Exporting the userschema to the database. (Populating the database with the user collection).
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;