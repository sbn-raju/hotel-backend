const express = require('express');
const missingValidator = require("../utils/missingFields.utils.js");
const {
  addRoomControllers,
  getRoomControllers,
  updateRoomController,
  deleteRoomControllers,
  fetchRoomControllers,
} = require('../controllers/rooms.controllers.js');
const upload = require('../middlewares/multer.middleware.js');
const multerWrapperMiddleware = require('../middlewares/validator.middleware.js');

const roomRoutes = express();

/**
 * @swagger
 * /api/v1.hotel/room/add:
 *   post:
 *     summary: Add a new room
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               floor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Room added successfully
 */
roomRoutes.route("/add").post(upload.array('room_images', 5), addRoomControllers);

/**
 * @swagger
 * /api/v1.hotel/room/get:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Room
 *     responses:
 *       200:
 *         description: List of rooms
 */
roomRoutes.route("/get").get(getRoomControllers);

/**
 * @swagger
 * /api/v1.hotel/room/update:
 *   patch:
 *     summary: Update a room
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room updated successfully
 */
roomRoutes.route("/update").patch(updateRoomController);

/**
 * @swagger
 * /api/v1.hotel/room/delete:
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
roomRoutes.route("/delete").delete(deleteRoomControllers);

roomRoutes.route("/fetch").get(fetchRoomControllers);

module.exports = roomRoutes;
