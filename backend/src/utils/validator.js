const validator = require("validator")


const validate = (data)=>{

    const mandatoryField = ["firstName","emailId","password"];

    const IsAllowed = mandatoryField.every((key)=>Object.keys(data).includes(key));

    if(!IsAllowed)
        throw new Error("Some fields missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid email");

    if(!validator.isStrongPassword(data.password))
      throw new Error("Weak Password");  
}
module.exports = validate;