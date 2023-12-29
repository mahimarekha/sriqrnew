const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const TransactionDetailesSchema = new mongoose.Schema(
  {
  
    tracking_id: {
        type: String,
        required: false,
      },
      bank_ref_no: {
        type: String,
        required: false,
      },
      order_id: {
        
        type:  mongoose.Schema.Types.ObjectId,
        ref: "TicketBooking",
        required: false,
       },
       amount: {
        type: String,
        required: false,
      },
      order_status: {
        type: String,
        required: false,
      },
      payment_mode: {
        type: String,
        required: false,
      },
      card_name: {
        type: String,
        required: false,
      },
      status_code: {
        type: String,
        required: false,
      },
      status_message: {
        type: String,
        required: false,
      }, 
     billing_tel:  {
        type: String,
        required: false,
      }, 
      
      trans_date:  {
        type: String,
        required: false,
      }, 
  },
  {
    timestamps: true,
  }
);

const TransactionDetailes = mongoose.models.TransactionDetailes || mongoose.model('TransactionDetailes', TransactionDetailesSchema);

module.exports = TransactionDetailes;
