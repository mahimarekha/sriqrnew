const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ticketBookingSchema = new mongoose.Schema(
  {
    fee:   [{
    
    }],
    totalAmount: {
      type: Number,
      required: true,
    },
    parkId : {
        
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Park",
            required: true,
    },
    mobile : {
      type: String,
      required: true,
    },
    paymentStatus : {
        type: String,
        required: true,
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

const TicketBooking = mongoose.models.TicketBooking || mongoose.model('TicketBooking', ticketBookingSchema);

module.exports = TicketBooking;
