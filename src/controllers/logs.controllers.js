const ExtrasLog = require("../models/Logs.models.js");
const { v4: uuidv4 } = require('uuid'); // Make sure to install uuid: npm install uuid

// 1. Fetch All ExtrasLogs
const getAllExtrasLogsController = async(req, res) => {
    try {
        // Getting all extras logs from the database
        const extrasLogs = await ExtrasLog.find({});

        return res.status(200).json({
            success: true,
            message: "All extras logs fetched successfully",
            data: extrasLogs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// 2. Get One ExtrasLog
const getExtrasLogController = async(req, res) => {
    // Getting the extras log id from query
    const { id } = req.query;

    // Validation check
    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Id is missing"
        });
    }

    try {
        // Finding the extras log with the id
        const extrasLog = await ExtrasLog.findOne({ id: id });

        // Check if extras log exists
        if(!extrasLog) {
            return res.status(404).json({
                success: false,
                message: "Extras log doesn't exist"
            });
        }

        // Returning the extras log details to the client
        return res.status(200).json({
            success: true,
            message: "Extras log fetched successfully",
            data: extrasLog
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// 3. Add ExtrasLog
const addExtrasLogController = async(req, res) => {
    // Getting all the details from the user to add into the database
    const { 
        extra_bed_cost, 
        extra_person_cost, 
        total_rooms, 
        total_rooms_booked, 
        total_rooms_available,
        total_extra_beds,
        total_extra_persons,
        total_4bedrooms_available,
        total_2bedrooms_available,
        total_3bedrooms_available
    } = req.body;

    try {
        // Making the extras log model and adding the record
        const newExtrasLog = new ExtrasLog({
            extra_bed_cost: extra_bed_cost || 0,
            extra_person_cost: extra_person_cost || 0,
            total_rooms: total_rooms || 0,
            total_rooms_booked: total_rooms_booked || 0,
            total_rooms_available: total_rooms_available || 0,
            total_extra_beds: total_extra_beds || 0,
            total_extra_persons: total_extra_persons || 0,
            total_4bedrooms_available: total_4bedrooms_available || 0,
            total_2bedrooms_available: total_2bedrooms_available || 0,
            total_3bedrooms_available: total_3bedrooms_available || 0
        });

        // Saving the new extras log model in the database
        const result = await newExtrasLog.save();

        console.log(result);
        return res.status(201).json({
            success: true,
            message: "Extras log added successfully",
            data: result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// 4. Update ExtrasLog
const updateExtrasLogController = async(req, res) => {
    // Getting the id from the request query
    const { id } = req?.query;
    const { 
        extra_bed_cost, 
        extra_person_cost, 
        total_rooms, 
        total_rooms_booked, 
        total_rooms_available,
        total_extra_beds,
        total_extra_persons,
        total_4bedrooms_available,
        total_2bedrooms_available,
        total_3bedrooms_available
    } = req?.body;

    // Validation check
    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Id is missing for the extras log"
        });
    }

    try {
        // Updating the details of the extras log
        const updateExtrasLog = await ExtrasLog.findOneAndUpdate(
            { id: id },
            {
                extra_bed_cost: extra_bed_cost,
                extra_person_cost: extra_person_cost,
                total_rooms: total_rooms,
                total_rooms_booked: total_rooms_booked,
                total_rooms_available: total_rooms_available,
                total_extra_beds: total_extra_beds,
                total_extra_persons: total_extra_persons,
                total_4bedrooms_available: total_4bedrooms_available,
                total_2bedrooms_available: total_2bedrooms_available,
                total_3bedrooms_available: total_3bedrooms_available
            },
            { new: true } // Return the updated document
        );

        if(!updateExtrasLog) {
            return res.status(404).json({
                success: false,
                message: "Extras log not found to update"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Extras log updated successfully",
            data: updateExtrasLog
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// 5. Delete ExtrasLog
const deleteExtrasLogController = async(req, res) => {
    // Getting the extras log id from query
    const { id } = req.query;

    // Validation check
    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Id is missing"
        });
    }

    try {
        // Finding and deleting the extras log with the id
        const extrasLog = await ExtrasLog.findOneAndDelete({ id: id });

        // Check if extras log exists
        if(!extrasLog) {
            return res.status(404).json({
                success: false,
                message: "Extras log doesn't exist"
            });
        }

        // Returning success message to the client
        return res.status(200).json({
            success: true,
            message: "Extras log deleted successfully",
            data: extrasLog
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllExtrasLogsController,
    getExtrasLogController,
    addExtrasLogController,
    updateExtrasLogController,
    deleteExtrasLogController
};