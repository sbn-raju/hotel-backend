const express = require("express");
const path = require('path')
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const connectDb = require("./database/connect.database");
const authRoutes = require("./routes/auth.routes.js");
const roomRoutes = require("./routes/rooms.routes.js");
const passport = require('passport');
const paymentRoutes = require("./routes/payment.routes.js");
const extrasRoutes = require("./routes/logs.routes.js");
dotenv.config();

//Creating the app.
const app = express();

//Adding cors.
app.use(cors({
    origin: ["http://localhost:5173", "https://hotel-frontend-three-khaki.vercel.app"],
    credentials: true,
}));


// Initialize Passport
app.use(passport.initialize());


//Adding the Cookie-parser.
app.use(cookieParser());

//Enabling the url encoded and json.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//This is to server the static files from the server.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Importing from the env file.
const PORT = process.env.PORT;

//Here call the database connection function.
connectDb();

app.get("/", (req, res) => {
  res.send("Hello Railway!");
});

//Routes.
app.use("/api/v1.hotel/auth", authRoutes);

app.use("/api/v1.hotel/room", roomRoutes);

app.use("/api/v1.hotel/extras", extrasRoutes);

app.use("/api/v1.hotel/payment", paymentRoutes);

//Docs Routes.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Listening to the app.
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
})