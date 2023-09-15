const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const parkSchema = new mongoose.Schema(
  {
    parkName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    adult : {
      type: Boolean,
      required: false,
      default:false
    },
    child : {
      type: Boolean,
      required: false,
      default:false
    },
    isCloakRoom : {
      type: Boolean,
      required: false,
      default:false
    },
    isHolidays : {
      type: Boolean,
      required: false,
      default:false
    },
    holidayDays : {
      type: String,
      required: false,
    },
    adultFee : {
      type: String,
      required: false,
      default:0
    },
    childFee : {
      type: String,
      required: false,
      default:0
    },
    seniorCitizen : {
      type: Boolean,
      required: false,
      default:0
    },
    seniorCitizenFee : {
      type: String,
      required: false,
      default:false
    },
    women : {
      type: Boolean,
      required: false,
      default:false
    },
    womenFee : {
      type: String,
      required: false,
      default:0
    },
    physicallyChallenged : {
      type: Boolean,
      required: false,
      default:false
    },
    physicallyChallengedFee : {
      type: String,
      required: false,
      default:0
    },
    camera : {
      type: Boolean,
      required: false,
      default:false
    },
    cameraFee : {
        type: String,
        required: false,
        default:0
      },
    photography : {
      type: Boolean,
      required: false,
      default:false
    },
    photographyFee : {
        type: String,
        required: false,
        default:0
      },
    shooting  : {
        type: Boolean,
        required: false,
        default:false
      },
      shootingFee:{
        type: String,
        required: false,
        default:0
      },
      walker:{
        type: Boolean,
        required: false,
        default:false
      },
      walkerFee:{
        type: String,
        required: false,
        default:0
      },
      startTime: { 
        type: String,
        required: false,
      },
      endTime: { 
        type: String,
        required: false,
      },
      note: {
        type: String,
        required: false,
      },
      profileRegistrationId: {
        type:  mongoose.Schema.Types.ObjectId,
            ref: "ProfileRegistration",
            required: true,
      },
  },
  {
    timestamps: true,
  }
);

const Park = mongoose.models.Park || mongoose.model('Park', parkSchema);

module.exports = Park;
