const mongoose = require('mongoose');

const profileRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },

        email:{
            type: String,
            unique:true,
            required: true,
        },
        role: {
            type: String,
            required: false,
          },
          name:{
            type: String,
            required: false,
          },
        mobileNumber1: {
            type: String,
            required: true,
        },
        mobileNumber2: {
            type: String,
            required: false,
        },
       password:{
            type: String,
            required: true,
        },
      
     },
    {
        timestamps: true,
    }
);

const ProfileRegistration = mongoose.models.ProfileRegistration || mongoose.model('ProfileRegistration', profileRegistrationSchema);
module.exports = ProfileRegistration;