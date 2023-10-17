const TicketBooking = require('../models/TicketBooking');
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
const addTicketBooking = async (req, res) => {
    try {
      req.body.paymentStatus = 'PENDING';
      const newTicketBooking = new TicketBooking(req.body);
     const bookingDetails= await newTicketBooking.save();

// const orderDetails = {
//   mobile:bookingDetails.mobile,
//   parkName:req.body.parkName,
//   date:new Date(),
// ...getDetails(bookingDetails.fee)
// }

//       QRCode.toDataURL(`${JSON.stringify(orderDetails)}`, function (err, url) {
       
//          res.send( { image:url,message: 'TicketBooking Added Successfully!', id:bookingDetails._id});
  
//       })
      res.send( { image:'',message: 'TicketBooking Added Successfully!', id:bookingDetails._id});
  
      // res.status(200).send({
      //   message: 'TicketBooking Added Successfully!',
      // });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };



  const addAllTicketBooking = async (req, res) => {
    try {
      await TicketBooking.insertMany(req.body);
      res.status(200).send({
        message: 'Ticket Booking Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
 
  const getAllTicketBooking = async (req, res) => {
    try {
      let preparePost ={};
      const ticketBooking = await TicketBooking.find(preparePost).populate("parkId");
      res.send(ticketBooking);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
const findTicketBookingList=async(req, res)=>{
  let preparePost ={};

 
  try {
    const ticketBooking = await TicketBooking.find(preparePost);
   
    res.send(ticketBooking);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

const getQRCodeByStatus=async(req, res)=>{


  if(!req.body.bookingId){
    res.status(500).send({
      message: "Booking Id is required",
    });
    return;
  }
  let preparePost ={
    _id:req.body.bookingId,
    paymentStatus:'TXN_SUCCESS',
    isTicketScanned : false,
  };

 
  try {
    const ticketBooking = await TicketBooking.find(preparePost).populate("parkId");
   
    if(ticketBooking.length>0){
      const bookingDetails = ticketBooking[0];
      const orderDetails = {
        mobile:bookingDetails.mobile,
        parkName:bookingDetails.parkId.parkName,
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
    parkId:req.body.parkId,
    paymentStatus:'TXN_SUCCESS',
    isTicketScanned : false,
    "createdAt": { $gte: `${todayStart}T00:00:00.000Z`, $lte:`${todayEnd}T23:59:00.000Z`}
  };
console.log(preparePost)
 
  try {
    const ticketBooking = await TicketBooking.find(preparePost).populate("parkId");
    console.log(ticketBooking)
   const finalData= [];
    if(ticketBooking.length>0){
      const bookingDetails = ticketBooking;
      for (const key of ticketBooking) {
       
        const orderDetails = {
          mobile:key.mobile,
          parkName:key.parkId.parkName,
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
const getTicketBookingList=async(req, res)=>{
  let preparePost ={ "paymentStatus" : "TXN_SUCCESS"};

  if(!req.body.parkId){
  return  res.status(500).send({
      message: 'Park Id is required',
    });
  }
  if(req.body.parkId){
    preparePost = {"parkId" : ObjectId(req.body.parkId)};

  }
  if (req.body.startDate && req.body.endDate) {
    preparePost = { ...preparePost, ...{ "createdAt": { $gte: new Date(req.body.startDate), $lte: new Date(req.body.endDate) } } };
  }
  try {
    console.log(preparePost)
   // const ticketBooking = await TicketBooking.find(preparePost);
    const ticketBooking = await TicketBooking.aggregate(
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
    res.send(ticketBooking);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
  const getTicketBookingById = async (req, res) => {
    console.log(req.params.id)
    try {
      let ticketBooking = await TicketBooking.findById(req.params.id);
      if (!ticketBooking) {
        ticketBooking = []; 
      }
      console.log(ticketBooking)
      res.send(ticketBooking);
     
    } catch (err) {
      
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateTicketBooking = async (req, res) => {
    try {
      console.log(req.params.id)
      const ticketBooking = await TicketBooking.findById(req.params.id);
      if (ticketBooking) {
        ticketBooking.fee = req.body.fee;
        ticketBooking.totalAmount = req.body.totalAmount;
        ticketBooking.parkId = req.body.parkId;
        ticketBooking.mobile = req.body.mobile;
        ticketBooking.paymentStatus= req.body.paymentStatus;
        await ticketBooking.save();
        res.send({ message: 'Ticket Booking Updated Successfully!' });
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
    const result =  await TicketBooking.updateOne({ _id: req.params.id }, { $set: { isTicketScanned: req.body.isTicketScannned} });
     let ticketBooking = await TicketBooking.findById(req.params.id);
  
      if (result) {
        res.send({ message: 'Ticket Scannned Updated Successfully!',
        bookingDetails:ticketBooking.fee,
        orderId:ticketBooking.invoice,
        _id:ticketBooking._id,
        totalAmount:ticketBooking.totalAmount});
      }
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
  const deleteTicketBooking = (req, res) => {
    TicketBooking.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Ticket Booking Deleted Successfully!',
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
      if(req.body.parkId){
        preparePost = {...preparePost,...{"parkId" : ObjectId(req.body.parkId)}};
      }
      const ticketBooking = await TicketBooking.find(preparePost).populate("profileRegistrationId").populate("parkId");
      res.send(ticketBooking);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  

  module.exports = {
    addTicketBooking,
     addAllTicketBooking,
    getAllTicketBooking,
   getTicketBookingById,
    updateTicketBooking,
    deleteTicketBooking,
    findTicketBookingList,
    getAllProfileId,
    getTicketBookingList,
    getQRCodeByStatus,
    getQRCodeByMobile,
    updateIsTicketScannned
  };