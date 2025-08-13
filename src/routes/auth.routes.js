const express = require('express');
const { authLoginController, getUserControllers, refreshTokenControllers, triggerOneTimePasswordController, authGoogleCallBackController } = require('../controllers/auth.controllers.js');
const missingValidator = require("../utils/missingFields.utils.js");
const authenticateUser = require('../middlewares/auth.middleware.js');
const passport = require('passport');
require('../middlewares/googleAuth.middleware.js');

const authRoutes = express();

//Inizalizing the passport here.
authRoutes.use(passport.initialize());

/**
 * @swagger
 * /api/v1.hotel/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
authRoutes.route('/login').post(authLoginController);

/**
 * @swagger
 * /api/v1.hotel/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token refreshed
 */
authRoutes.route('/refresh-token').post(refreshTokenControllers);



/**
 * @swagger
 * /api/v1.hotel/auth/user:
 *   get:
 *     summary: Get authenticated user details
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data fetched successfully
 */
authRoutes.route('/user').get(authenticateUser, getUserControllers);



authRoutes.route('/google').get(passport.authenticate('google', {scope: ['profile', 'email']}));

authRoutes.route('/google/callback').get(passport.authenticate('google', {session: false, failureRedirect: '/' }), authGoogleCallBackController);

module.exports = authRoutes