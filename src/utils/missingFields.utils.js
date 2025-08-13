const { model } = require("mongoose");

//Validation for the missing field for all controller.
const missingValidator = async(req, res)=>{
 
    //Getting all the inputs from the body.
    const data = req.body;

    //Missing Fields.
    const missingField = [];

    console.log(data);

    for (const key in data) {
    if (
      data[key] === undefined ||
      data[key] === null ||
      (typeof data[key] === 'string' && data[key].trim() === '')
    ) {
      missingField.push(key);
    }
  }

    if(missingField.length != 0){
        return res.status(400).json({
            success: false,
            message: "Missing Fields",
            data: missingField.join(", ")
        })
    }
    
}



module.exports = missingValidator