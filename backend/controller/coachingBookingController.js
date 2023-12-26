const CoachingBooking = require('../models/CoachingBooking');
var QRCode = require('qrcode')
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');
dayjs.extend(utc);
dayjs.extend(timezone)
const getDetails =(inputArray)=>{
  const resultObject = {};

// Loop through the array and populate the object
for (const item of inputArray) {
  resultObject[item.name] = item.quantity;
}
 return resultObject;
}
const addCoachingBooking = async (req, res) => {
    try {
      req.body.paymentStatus = 'PENDING';
      const newCoachingBooking = new CoachingBooking(req.body);
     const CoachingDetails= await newCoachingBooking.save();

// const orderDetails = {
//   mobile:bookingDetails.mobile,
//   parkName:req.body.parkName,
//   date:new Date(),
// ...getDetails(bookingDetails.fee)
// }

//       QRCode.toDataURL(`${JSON.stringify(orderDetails)}`, function (err, url) {
       
//          res.send( { image:url,message: 'TicketBooking Added Successfully!', id:bookingDetails._id});
  
//       })
      res.send( { image:'',message: 'CoachingBooking Added Successfully!', id:bookingDetails._id});
  
      // res.status(200).send({
      //   message: 'TicketBooking Added Successfully!',
      // });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };



  const addAllCoachingBooking = async (req, res) => {
    try {
      await CoachingBooking.insertMany(req.body);
      res.status(200).send({
        message: 'Coaching Booking Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
 
  const getAllCoachingBooking = async (req, res) => {
    try {
      let preparePost ={};
      const coachingBooking = await CoachingBooking.find(preparePost).populate("batchId");
      res.send(coachingBooking);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
const findCoachingBookingList=async(req, res)=>{
  let preparePost ={};

 
  try {
    const coachingBooking = await CoachingBooking.find(preparePost);
   
    res.send(coachingBooking);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

const getQRCodeByStatus=async(req, res)=>{


  if(!req.body.coachingId){
    res.status(500).send({
      message: "Coaching Id is required",
    });
    return;
  }
  let preparePost ={
    _id:req.body.coachingId,
    paymentStatus:'TXN_SUCCESS',
    isTicketScanned : false,
  };

 
  try {
    const coachingBooking = await CoachingBooking.find(preparePost).populate("batchId");
   
    if(coachingBooking.length>0){
      const bookingDetails = coachingBooking[0];
      const orderDetails = {
        id:bookingDetails._id,
        mobile:bookingDetails.mobile,
        studentName:bookingDetails.studentName,
        email:bookingDetails.email,
         coachingName:bookingDetails.coachingId.coachingName,
        date:new Date(),
      ...getDetails(bookingDetails.fee)
      };
            QRCode.toDataURL(`${JSON.stringify(orderDetails)}`, function (err, url) {
             
               res.send( { status:true, image:url,message: 'Your transation successfully completed , your booking id is'+bookingDetails.invoice+'.', id:bookingDetails._id});
        
            })

    }else{
  res.send({
        status:false,
        message:"Your transation is failed please contact support team"
      });
    }
   
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
const getQRCodeByMobile=async(req, res)=>{


  if(!req.body.mobile){
    res.status(500).send({
      message: "Mobile is required",
    });
    return;
  }
  const todayStart = dayjs().format('YYYY-MM-DD');
  const todayEnd = dayjs().format('YYYY-MM-DD');

  console.log( `${todayStart}T00:00:00.000Z`)
  console.log(`${todayEnd}T23:59:00.000Z` )
  let preparePost ={
    mobile:req.body.mobile,
    studentName:req.body.studentName,
    email:req.body.email,
    coachingId:req.body.coachingId,
    paymentStatus:'TXN_SUCCESS',
    isTicketScanned : false,
    "createdAt": { $gte: `${todayStart}T00:00:00.000Z`, $lte:`${todayEnd}T23:59:00.000Z`}
  };
console.log(preparePost)
 
  try {
    const coachingBooking = await CoachingBooking.find(preparePost).populate("batchId");
    console.log(coachingBooking)
   const finalData= [];
    if(coachingBooking.length>0){
      const bookingDetails = coachingBooking;
      for (const key of coachingBooking) {
       
        const orderDetails = {
          mobile:key.mobile,
          studentName:key.studentName,
          email:key.email,
          coachingName:key.coachingId.coachingName,
          date:new Date(),
        ...getDetails(key.fee)
        };
    const qrCode =   await  QRCode.toDataURL(`${JSON.stringify(orderDetails)}`);
              // QRCode.toDataURL(`${JSON.stringify(orderDetails)}`, function (err, url) {
               
              //    res.send( { status:true, image:url,message: 'Your transation successfully completed , your booking id is'+bookingDetails.invoice+'.', id:bookingDetails._id});
          
              // })
              finalData.push({ status:true, image:qrCode,message: 'Your transation successfully completed , your booking id is'+key.invoice+'.', id:key._id})
             // console.log(qrCode)
       
      }
      res.send( {ticketDetails:finalData,message: 'Your transation successfully completed'});

    }else{
  res.send({
        status:false,
        ticketDetails:[],
        message:"No booking found"
      });
    }
   
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
const getCoachingBookingList=async(req, res)=>{
  let preparePost ={ "paymentStatus" : "TXN_SUCCESS"};

  if(!req.body.coachingId){
  return  res.status(500).send({
      message: 'coaching Id is required',
    });
  }
  if(req.body.coachingId){
    preparePost = {"coachingId" : ObjectId(req.body.coachingId)};

  }
  if (req.body.startDate && req.body.endDate) {
    preparePost = { ...preparePost, ...{ "createdAt": { $gte: new Date(req.body.startDate), $lte: new Date(req.body.endDate) } } };
  }
  try {
    console.log(preparePost)
   // const ticketBooking = await TicketBooking.find(preparePost);
    const coachingBooking = await CoachingBooking.aggregate(
      [
        {
          $match: preparePost
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            documents: { $push: "$$ROOT" } // Save all fields in an array for each group
          }
        },
        {
          $project: {
            _id: 0, // Exclude the "_id" field from the output
            createdAt: "$_id", // Rename "_id" to "createdAt"
            documents: 1 // Include the "documents" array in the output
          }
        },
        {
          $sort: {
            createdAt: -1 // Sort the results by createdAt in ascending order
          }
        }
      ]
    );
    res.send(coachingBooking);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
  const getCoachingBookingById = async (req, res) => {
    console.log(req.params.id)
    try {
      let coachingBooking = await coachingBooking.findById(req.params.id);
      if (!coachingBooking) {
        coachingBooking = []; 
      }
      console.log(coachingBooking)
      res.send(coachingBooking);
     
    } catch (err) {
      
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateCoachingBooking = async (req, res) => {
    try {
      console.log(req.params.id)
      const coachingBooking = await CoachingBooking.findById(req.params.id);
      if (coachingBooking) {
        coachingBooking.totalAmount = req.body.totalAmount;
        coachingBooking.coachingId = req.body.coachingId;
        coachingBooking.mobile = req.body.mobile;
        coachingBooking.email = req.body.email;
        coachingBooking.studentName = req.body.studentName;
        coachingBooking.paymentStatus= req.body.paymentStatus;
        await coachingBooking.save();
        res.send({ message: 'Coaching Booking  Updated Successfully!' });
      }
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
  const updateIsTicketScannned = async (req, res) => {
    try {
      console.log(req.params.id)
   
      if (req.body.tokenId!==process.env.SECRET) {
        return res.status(403).send({
          message: 'Invalid request please check secret key.',
        });
      }
      if (!req.params.id) {
        return res.status(403).send({
          message: 'Booking Id is required.',
        });
      }
      let coachingBooking = await CoachingBooking.findById(req.params.id);
  
      const result =  await CoachingBooking.updateOne({ _id: req.params.id }, { $set: { isTicketScanned: req.body.isTicketScannned} });
    
      if (result && coachingBooking.paymentStatus === 'TXN_SUCCESS' && !coachingBooking.isTicketScanned) {
        res.send({ message: 'Ticket Scannned Updated Successfully!',
        
        orderId:coachingBooking.invoice,
        _id:coachingBooking._id,
        totalAmount:coachingBooking.totalAmount});
      }else{
        res.send({ message: 'Invalid Ticket!',
        bookingDetails:[],
        orderId:0,
        _id:'',
        totalAmount:0});
      }
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
  const deleteCoachingBooking = (req, res) => {
    CoachingBooking.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Coaching Booking Deleted Successfully!',
        });
      }
    });
  };
  const getAllProfileId = async (req, res) => {
    try {
      let preparePost ={ "paymentStatus" : "TXN_SUCCESS"};
      if(req.body.profileRegistrationId){
        preparePost = {"profileRegistrationId" : ObjectId(req.body.profileRegistrationId)};
      }
      if(req.body.coachingId){
        preparePost = {...preparePost,...{"batchId" : ObjectId(req.body.coachingId)}};
      }
      const coachingBooking = await CoachingBooking.find(preparePost).populate("profileRegistrationId").populate("batchId");
      res.send(coachingBooking);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  

  module.exports = {
    addCoachingBooking,
     addAllCoachingBooking,
    getAllCoachingBooking,
   getCoachingBookingById,
    updateCoachingBooking,
    deleteCoachingBooking,
    findCoachingBookingList,
    getAllProfileId,
    getCoachingBookingList,
    getQRCodeByStatus,
    getQRCodeByMobile,
    updateIsTicketScannned
  };