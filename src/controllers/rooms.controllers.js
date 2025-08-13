const { model } = require("mongoose");
const Room = require("../models/Rooms.models");
const crypto = require("crypto");
const filesUploadMongoDb = require("../helper/fileHandler.helper");

const addRoomControllers = async (req, res) => {
  const {
    room_type,
    room_price,
    room_facilities,
    room_food,
    image_metadata_json,
  } = req.body;

  console.log(req.body);

  // 1. Validate files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Images are not found",
    });
  }

  // 2. Validate room fields
  if (!room_type || !room_price) {
    return res.status(400).json({
      success: false,
      message: "Room type and Room price is required",
    });
  }

  // 3. Parse image metadata
  let metaData;
  try {
    metaData = JSON.parse(image_metadata_json);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid image metadata JSON",
    });
  }

  // 4. Upload files sequentially
  const room_images_url = [];

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const id = crypto.randomUUID();
        const fileOriginalname = file?.filename.split("~")[1];
        const fileMetaData = metaData.find(
          (item) => item.name === fileOriginalname
        );

        if (!fileMetaData) {
          throw new Error(`Metadata not found for file ${fileOriginalname}`);
        }

        const singleFile = {
          id,
          path: `https://hotel-backend-production-a5b0.up.railway.app/uploads/${file?.path.split("uploads\\")[1]}`,
          isMain: fileMetaData?.isMain,
          isThumbnail: fileMetaData?.isThumbnail,
        };

        //Push the Image into the main server then distribute over the CDN(Content Delivery Network)
        
        room_images_url.push(singleFile);
      })
    );

    // 5. Create and save the room
    const newRoom = new Room({
      room_type,
      room_facilities: {
        room_bed_count: room_facilities?.room_bed_count,
        room_ac : room_facilities?.room_ac,
        room_hotWater: room_facilities?.room_hotWater,
        room_minibar: room_facilities?.room_minibar,
      },
      room_food: {
        breakfast: room_food?.breakfast,
        lunch: room_food?.lunch,
        dinner: room_food?.dinner,
      },
      room_price,
      room_images_metadata: room_images_url,
      sgst: (room_price * 9) / 100,
      cgst: (room_price * 9) / 100,
    });

    const result = await newRoom.save();

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};



//This controller will get the single room.
const getRoomControllers = async (req, res) => {
  //Getting the room controllers.
  const { id } = req.query;

  //Validation check.
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is missing",
    });
  }

  try {
    //Finding the room with the id.
    const room = await Room.findOne({ _id: id });

    //Check if room exists.
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Room does't exists.",
      });
    }

    //Returning the room details to the client.
    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Update the room using the id of the room.
const updateRoomController = async (req, res) => {
  //Getting the id from the request query.
  const { id } = req?.query;
  const {
    room_type,
    room_price,
    room_bed_count,
    room_ac,
    room_breakfast,
    room_lunch,
    room_dinner,
    room_minibar,
    room_hotwater,
  } = req?.body;

  //Validation check.
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is missing of the room",
    });
  }

  //Updating the details of the room.
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      { _id: id },
      {
        room_type: room_type,
        room_food: {
          breakfast: room_breakfast,
          dinner: room_dinner,
          lunch: room_lunch,
        },
        room_facilities: {
          room_bed_count: room_bed_count,
          room_ac: room_ac,
          room_hotWater: room_hotwater,
          room_minibar: room_hotwater,
        },
        room_price: room_price,
        sgst: (room_price * 9) / 100,
        cgst: (room_price * 9) / 100,
      }
    );

    if (!updateRoom) {
      return res.status(400).json({
        success: false,
        message: "Room not found to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



//This controller will get the single room.
const deleteRoomControllers = async (req, res) => {
  //Getting the room controllers.
  const { id } = req.query;

  //Validation check.
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is missing",
    });
  }

  try {
    //Finding the room with the id.
    const room = await Room.findOneAndDelete({ _id: id });

    //Check if room exists.
    if (!room) {
      return res.status(200).json({
        success: false,
        message: "Room does't exists.",
      });
    }

    //Returning the room details to the client.
    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      data: room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchRoomControllers = async (req, res) => {
  const page = parseInt(req?.query?.page, 10) || 1;
  const limit = parseInt(req?.query?.limit, 10) || 4;

  //Calculating the offset.
  const skip = (page - 1) * limit;

  try {
   // Get total number of documents
  const total = await Room.countDocuments();

  // Get paginated results
  const newResults = await Room.find().skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: newResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addRoomControllers,
  getRoomControllers,
  updateRoomController,
  deleteRoomControllers,
  fetchRoomControllers,
};
