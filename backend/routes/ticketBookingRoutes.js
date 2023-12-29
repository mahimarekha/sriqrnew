require('dotenv').config()
const express = require('express');
const https=require('https')
const TicketBooking = require('../models/TicketBooking');
const TransactionDetailes=require('../models/TransactionDetailes');
const formidable=require('formidable')
const until = require('../config/auth');
const { isAuth, isAdmin } = require('../config/auth');
const ccav = require('../utils/ccavutil');
const router = express.Router();
const {v4:uuidv4}=require('uuid')
const {getTicketBookingList,getQRCodeByStatus,getQRCodeByMobile,updateIsTicketScannned,
    addTicketBooking, addAllTicketBooking, getAllTicketBooking, updateTicketBooking,
    deleteTicketBooking,findTicketBookingList, getTicketBookingById, getAllProfileId
} = require('../controller/ticketBookingController');
// import queryString from 'query-string';
const queryString= require('querystring');
const crypto = require('crypto');
const PaytmChecksum=require('../controller/PaytmChecksum')

router.post('/add', addTicketBooking);
router.post('/profileid',isAuth, getAllProfileId);
router.put('/:id',isAuth, updateTicketBooking);
router.put('/qrstatus/:id', updateIsTicketScannned);
router.post('/all',isAuth, addAllTicketBooking);
router.post('/find',isAuth, findTicketBookingList);

router.post('/report',isAuth, getTicketBookingList);
router.post('/getqrcodebystatus', getQRCodeByStatus);
router.post('/getqrcodebymobile', getQRCodeByMobile);
router.get('/list',isAuth, getAllTicketBooking);
router.get('/:id', getTicketBookingById);
const paymentStatusUpdate=  (id, status, transactionDetailes) => {
    TicketBooking.updateOne({ _id: id }, { $set: { paymentStatus: status } }, (err, result) => {
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
                    response += chunk;
                });

                post_res.on('end', async function () {
                    let result = JSON.parse(response)
                  
                  const orderdetails =  await TicketBooking.findById(result.ORDERID);
                    if (result.STATUS === 'TXN_SUCCESS') {
                        console.log(result.STATUS)
                        try {
                            const bookingDetails =  await TicketBooking.updateOne({ _id: result.ORDERID }, { $set: { paymentStatus: result.STATUS } })
                            const newTransactionDetailes = new TransactionDetailes(result);
                            await newTransactionDetailes.save();
                            
                            res.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${result.ORDERID}/${orderdetails.parkId}`)

                        } catch (error) {
                            console.log(error);
                        }
                       
                    } else {
                        try {
                          const bookingDetails =  await TicketBooking.updateOne({ _id: result.ORDERID }, { $set: { paymentStatus: result.STATUS } })
                            const newTransactionDetailes = new TransactionDetailes(result);
                            await newTransactionDetailes.save();
                            
                            res.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${result.ORDERID}/${orderdetails.parkId}`)
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

router.post('/ccav/payment', (request, res) => {
    const params = request.body;
	workingKey = process.env.CCEV_WORKINGKEY,	//Put in the 32-Bit key shared by CCAvenues.
	accessCode = process.env.CCEV_ACCESSKEY,			//Put in the Access Code shared by CCAvenues.
	encRequest = '',
	formbody = '';
    params.amount = params.amount;
    params.order_id= params.id,
    params.redirect_url= process.env.CALLBACK_URL;
    params.billing_address= "Hyderabad";
    params.billing_city= "Hyderabad";
    params.billing_country= "India";
    params.billing_email= "testing@domain.com";
    params.billing_name= params.mobile;
    params.billing_state= "TS";
    params.billing_tel= params.mobile;
    params.billing_zip= "400054";
    params.cancel_url= process.env.CALLBACK_URL;
    params.currency= "INR";
    params.language= "EN";
    params.merchant_id= "3133515";
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');
    const  data = queryString.stringify(params);
    encRequest = ccav.encrypt(data, keyBase64, ivBase64); 
	res.send({encRequest:encRequest,access_code:accessCode});
})

router.post('/ccav/callback',async (request, response) => {
  const result = request.body;
    var ccavEncResponse='',
	ccavResponse='',	
	workingKey = process.env.CCEV_WORKINGKEY,	//Put in the 32-Bit key shared by CCAvenues.
	ccavPOST = '';
    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');
    var encryption = result.encResp;
    ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
    const resultDetails = ccav.queryStringToJson(ccavResponse);
      
    const orderdetails =  await TicketBooking.findById(resultDetails.order_id);
    if (resultDetails.order_status && resultDetails.order_status === 'Success') {
        try {
            const bookingDetails =  await TicketBooking.updateOne({ _id: resultDetails.order_id }, { $set: { paymentStatus: 'TXN_SUCCESS' } })
            const newTransactionDetailes = new TransactionDetailes(resultDetails);
            await newTransactionDetailes.save();
            
            response.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${resultDetails.order_id}/${orderdetails.parkId}`)

        } catch (error) {
            console.log(error);
        }
       
    } else {
        try {
          const bookingDetails =  await TicketBooking.updateOne({ _id: resultDetails.order_id }, { $set: { paymentStatus: resultDetails.order_status } })
            const newTransactionDetailes = new TransactionDetailes(resultDetails);
            await newTransactionDetailes.save();
            
            response.redirect(`${process.env.QR_CODE_URL}/#/paymentstatus/${resultDetails.order_id}/${orderdetails.parkId}`)
        } catch (error) {
            console.log(error);
        }
       
    }



})

module.exports = router;