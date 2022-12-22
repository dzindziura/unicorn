const mongoose = require("mongoose");
const validator = require("email-validator");
const validatePhoneNumber = require('validate-phone-number-node-js');

const UserShema = new mongoose.Schema(
  {
    login: {
        type: String,
        required: true, 
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    id_type: {
      type: String,
      require: true
    },
    token: {
      type: String,
      default: ''
    }
    
  },
  {
     timestamps: true,

  } 
);

UserShema.path('login').validate((v) => {
  if(validatePhoneNumber.validate(v)){
    return true;
  }
    return validator.validate(v);
}, 'Email or number not valid')

module.exports = mongoose.model("User", UserShema);