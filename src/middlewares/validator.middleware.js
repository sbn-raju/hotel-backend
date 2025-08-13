const multer = require("multer");
const upload = require("./multer.middleware.js");

const multerWrapperMiddleware = async (req, res, next) => {
  upload.array('room_images', 5)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Multer-specific errors
      let message = "";
      switch (error.code) {
        case "LIMIT_FILE_SIZE":
          message = "Each image must be less than 1MB.";
          break;
        case "LIMIT_UNEXPECTED_FILE":
          message = "Only .jpeg, .jpg, .png files are allowed.";
          break;
        default:
          message = "Multer error: " + error.message;
      }
      return res.status(400).json({ success: false, message });
    } else if (error) {
      // Unknown error
      return res.status(500).json({ success: false, message: error.message });
    }
    // Proceed to controller
    next();
  });
};


module.exports = multerWrapperMiddleware
