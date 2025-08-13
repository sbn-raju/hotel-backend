const express = require('express');
const {
  getAllExtrasLogsController,
  getExtrasLogController,
  addExtrasLogController,
  updateExtrasLogController,
  deleteExtrasLogController
} = require('../controllers/logs.controllers.js');

const extrasRoutes = express();

/**
 * @swagger
 * /api/v1.hotel/extras/all:
 *   get:
 *     summary: Get all extras logs
 *     tags:
 *       - Extras Log
 *     responses:
 *       200:
 *         description: All extras logs fetched successfully
 */
extrasRoutes.route('/all').get(getAllExtrasLogsController);

/**
 * @swagger
 * /api/v1.hotel/extras/one:
 *   get:
 *     summary: Get one extras log by ID
 *     tags:
 *       - Extras Log
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the extras log
 *     responses:
 *       200:
 *         description: Single extras log fetched successfully
 */
extrasRoutes.route('/one').get(getExtrasLogController);

/**
 * @swagger
 * /api/v1.hotel/extras/add:
 *   post:
 *     summary: Add a new extras log
 *     tags:
 *       - Extras Log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extra_bed_cost:
 *                 type: number
 *               extra_person_cost:
 *                 type: number
 *               total_rooms:
 *                 type: number
 *               total_rooms_booked:
 *                 type: number
 *               total_rooms_available:
 *                 type: number
 *               total_extra_beds:
 *                 type: number
 *               total_extra_persons:
 *                 type: number
 *               total_4bedrooms_available:
 *                 type: number
 *               total_3bedrooms_available:
 *                 type: number
 *               total_2bedrooms_available:
 *                 type: number
 *     responses:
 *       201:
 *         description: Extras log added successfully
 */
extrasRoutes.route('/add').post(addExtrasLogController);

/**
 * @swagger
 * /api/v1.hotel/extras/update:
 *   patch:
 *     summary: Update an extras log by ID
 *     tags:
 *       - Extras Log
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the extras log to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extra_bed_cost:
 *                 type: number
 *               extra_person_cost:
 *                 type: number
 *               total_rooms:
 *                 type: number
 *               total_rooms_booked:
 *                 type: number
 *               total_rooms_available:
 *                 type: number
 *               total_extra_beds:
 *                 type: number
 *               total_extra_persons:
 *                 type: number
 *               total_4bedrooms_available:
 *                 type: number
 *               total_3bedrooms_available:
 *                 type: number
 *               total_2bedrooms_available:
 *                 type: number
 *     responses:
 *       200:
 *         description: Extras log updated successfully
 */
extrasRoutes.route('/update').patch(updateExtrasLogController);

/**
 * @swagger
 * /api/v1.hotel/extras/delete:
 *   delete:
 *     summary: Delete an extras log by ID
 *     tags:
 *       - Extras Log
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the extras log to delete
 *     responses:
 *       200:
 *         description: Extras log deleted successfully
 */
extrasRoutes.route('/delete').delete(deleteExtrasLogController);

module.exports = extrasRoutes;
