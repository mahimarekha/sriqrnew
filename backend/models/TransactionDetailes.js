const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const TransactionDetailesSchema = new mongoose.Schema(
  {
  
     TXNID: {
        type: String,
        required: true,
      },
    BANKTXNID: {
        type: String,
        required: true,
      },
    ORDERID: {
        
        type:  mongoose.Schema.Types.ObjectId,
        ref: "TicketBooking",
        required: true,
},
    TXNAMOUNT: {
        type: String,
        required: true,
      },
    STATUS: {
        type: String,
        required: true,
      },
    TXNTYPE: {
        type: String,
        required: true,
      },
    GATEWAYNAME: {
        type: String,
        required: true,
      },
    RESPCODE: {
        type: String,
        required: true,
      },
    RESPMSG: {
        type: String,
        required: true,
      }, 
         BANKNAME:  {
            type: String,
            required: true,
          }, 
      MID:  {
        type: String,
        required: true,
      }, 
      PAYMENTMODE:  {
        type: String,
        required: true,
      }, 
      REFUNDAMT: {
        type: String,
        required: true,
      }, 
      TXNDATE:  {
        type: String,
        required: true,
      }, 
  },
  {
    timestamps: true,
  }
);

const TransactionDetailes = mongoose.models.TransactionDetailes || mongoose.model('TransactionDetailes', TransactionDetailesSchema);

module.exports = TransactionDetailes;
