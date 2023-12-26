const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const coachingBookingSchema = new mongoose.Schema(
  {
   
    totalAmount: {
      type: Number,
      required: true,
    },
    batchId : {
        
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true,
    },
    mobile : {
      type: String,
      required: true,
    },
    email : {
        type: String,
        required: true,
      },
      studentName : {
        type: String,
        required: true,
      },
    paymentStatus : {
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
const CoachingBooking = mongoose.models.CoachingBooking || mongoose.model('CoachingBooking', coachingBookingSchema);

// const CoachingBooking =
//   mongoose.models.CoachingBooking ||
//   mongoose.model(
//     'CoachingBooking',
//     coachingBookingSchema.plugin(
//       AutoIncrement,
//        {
//       inc_field: 'invoice',
//       start_seq: 10000,
//     })
//   );
  
module.exports = CoachingBooking;

// const TicketBooking = mongoose.models.TicketBooking || mongoose.model('TicketBooking', ticketBookingSchema);

// module.exports = TicketBooking;
