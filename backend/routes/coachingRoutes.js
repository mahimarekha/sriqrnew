require('dotenv').config()
const express = require('express');
const https=require('https')
const CoachingBooking = require('../models/CoachingBooking');
const TransactionDetailes=require('../models/TransactionDetailes');
const formidable=require('formidable')
const {  isAdmin } = require('../config/auth');
const router = express.Router();
const {v4:uuidv4}=require('uuid')
const {getCoachingBookingList,getQRCodeByStatus,getQRCodeByMobile,updateIsTicketScannned,
    addCoachingBooking, addAllCoachingBooking, getAllCoachingBooking, updateCoachingBooking,
    deleteCoachingBooking,findCoachingBookingList, getCoachingBookingById, getAllProfileId
} = require('../controller/coachingBookingController');

const PaytmChecksum=require('../controller/PaytmChecksum')

router.post('/add', addCoachingBooking);
router.post('/profileid', getAllProfileId);
router.put('/:id', updateCoachingBooking);
router.put('/qrstatus/:id', updateIsTicketScannned);
router.post('/all', addAllCoachingBooking);
router.post('/find', findCoachingBookingList);

router.post('/report', getCoachingBookingList);
router.post('/getqrcodebystatus', getQRCodeByStatus);
router.post('/getqrcodebymobile', getQRCodeByMobile);
router.get('/list', getAllCoachingBooking);
router.get('/:id', getCoachingBookingById);
const paymentStatusUpdate=  (id, status, transactionDetailes) => {
    CoachingBooking.updateOne({ _id: id }, { $set: { paymentStatus: status } }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
                  const newTransactionDetailes = new TransactionDetailes(transactionDetailes);
                   newTransactionDetailes.save();

        }
      });
}

router.post('/callback', (req, res) => {
    const form = new formidable.IncomingForm();
    let paytmChecksum;
    const fields = req.body;
    paytmChecksum = fields.CHECKSUMHASH;
    delete fields.CHECKSUMHASH;
    var isVerifySignature = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);
    if (isVerifySignature) {
        var paytmParams = {};
        paytmParams["MID"] = fields.MID;
        paytmParams["ORDERID"] = fields.ORDERID;

        /*
        * Generate checksum by parameters we have
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */

        PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY).then(function (checksum) {
            paytmParams["CHECKSUMHASH"] = checksum;
            var post_data = JSON.stringify(paytmParams);
            console.log(post_data)
            var options = {
                /* for Staging */
                hostname: 'securegw-stage.paytm.in',
                /* for Production */
                // hostname: 'securegw.paytm.in',
                port: 443,
                path: '/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    console.log("dddd")
                    response += chunk;
                });

                post_res.on('end', async function () {
                    let result = JSON.parse(response)
                    console.log(result)
                  const orderdetails =  await CoachingBooking.findById(result.ORDERID);
                    if (result.STATUS === 'TXN_SUCCESS') {
                        console.log(result.STATUS)
                        try {
                            const bookingDetails =  await CoachingBooking.updateOne({ _id: result.ORDERID }, { $set: { paymentStatus: result.STATUS } })
                            const newTransactionDetailes = new TransactionDetailes(result);
                            await newTransactionDetailes.save();
                            
                            res.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${result.ORDERID}/${orderdetails.coachingId}`)

                        } catch (error) {
                            console.log(error);
                        }
                       
                    } else {
                        try {
                          const bookingDetails =  await CoachingBooking.updateOne({ _id: result.ORDERID }, { $set: { paymentStatus: result.STATUS } })
                            const newTransactionDetailes = new TransactionDetailes(result);
                            await newTransactionDetailes.save();
                            
                            res.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${result.ORDERID}/${orderdetails.coachingId}`)
                        } catch (error) {
                            console.log(error);
                        }
                       
                    }

                   


                });
            });

            post_req.write(post_data);
            post_req.end();
        });










    } else {
        console.log("Checksum Mismatched");
    }
    console.log(process.env.PAYTM_MERCHANT_KEY);




})

router.post('/payment', (req, res) => {


    const { amount, mobile, id } = req.body;

    /* import checksum generation utility */
    const totalAmount = JSON.stringify(amount);
    var params = {};

    /* initialize an array */
        params['MID'] = process.env.PAYTM_MID,
        params['WEBSITE'] = process.env.PAYTM_WEBSITE,
        params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID,
        params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID,
        params['ORDER_ID'] = id,
        params['CUST_ID'] = uuidv4(),
        params['TXN_AMOUNT'] = totalAmount,
        params['CALLBACK_URL'] = process.env.CALLBACK_URL,
        params['EMAIL'] = 'rekah@gmail.com',
        params['MOBILE_NO'] = mobile

    /**
    * Generate checksum by parameters we have
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
   console.log(params)
    var paytmChecksum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
    paytmChecksum.then(function (checksum) {
        let paytmParams = {
            ...params,
            "CHECKSUMHASH": checksum
        }
        res.json(paytmParams)
    }).catch(function (error) {
        console.log(error);
    });

})



module.exports = router;