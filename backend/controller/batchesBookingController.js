const Batch = require('../models/Batch');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
var QRCode = require('qrcode')
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');
dayjs.extend(utc);
const addBatch = async (req, res) => {
    try {
      const newBatch = new Batch(req.body);
      await newBatch.save();
      res.status(200).send({
        message: 'Batch Added Successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };

 
  const getBatchs = async (req, res) => {
    try {
      let preparePost ={};
      
      if(req.body.profileRegistrationId){
        preparePost = {"profileRegistrationId" : ObjectId(req.body.profileRegistrationId)};
      }
      const park = await Batch.find(preparePost);
      // const park = await Batch.find(preparePost).populate("profileRegistrationId");
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const loginBatch = async (req, res) => {
    try {
      console.log(req.body.email)
  
      const park = await Batch.findOne({ parkEmail: req.body.email });
      console.log(park)
      if (park && bcrypt.compareSync(req.body.password, park.password)) {
      
        const token = signInToken(park);
        res.send({
          token,
          email:park.parkEmail,
          _id : park._id,
          role:park.role,
          schoolId: park._id, 
        });
      } else {
        res.status(401).send({
          message: 'Invalid Emails or password!',
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const addAllBatch = async (req, res) => {
    try {
      await Batch.insertMany(req.body);
      res.status(200).send({
        message: 'Batch Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
 
  const getAllBatch = async (req, res) => {
    try {
      let preparePost ={};
      const park = await Batch.find(preparePost);
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  
  const getBatchName = async (req, res) => {
    try {
      let preparePost ={};
      const batch = await Batch.find(preparePost);
      
      res.send(batch);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
const findBatchList=async(req, res)=>{
  let preparePost ={};
  try {
    const batch = await Batch.find(preparePost);
    res.send(batch);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
  const getBatchById = async (req, res) => {
    console.log(req.params.id)
    try {
      let batch = await Batch.findById(req.params.id);
      if (!batch) {
        batch = []; 
      }
      
      res.send(batch);
     
    } catch (err) {
      
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateBatch = async (req, res) => {
    try {
      console.log(req.params.id)
      const batch = await Batch.findById(req.params.id);
      if (batch) {
        batch.batchName = req.body.batchName;
        batch.startDate = req.body.startDate;
        batch.endDate = req.body.endDate;
        batch.startTime = req.body.startTime;
        batch.endTime = req.body.endTime;
        batch.fee= req.body.fee;
        batch.inTake= req.body.inTake;
        batch.profileRegistrationId= req.body.profileRegistrationId;
        await batch.save();
        res.send({ message: 'Batch Updated Successfully!' });
      }
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
  
  const deleteBatch = (req, res) => {
    Batch.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Batch Deleted Successfully!',
        });
      }
    });
  };

  const qrCode = async(req, res) =>{
   
    const id=req.params.id;
    QRCode.toDataURL(`${process.env.QR_CODE_URL}/#/ticketbooking/${id}`, function (err, url) {
      console.log(url)
       res.send( { image:url });

    })
  };
  const addAllProfileId = async (req, res) => {
    try {
      let preparePost ={};
      if(req.body.profileRegistrationId){
        preparePost = {"profileRegistrationId" : ObjectId(req.body.profileRegistrationId)};
      }
      const park = await Batch.find(preparePost).populate("profileRegistrationId");
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  module.exports = {
    addBatch,
    getBatchName,
     addAllBatch,
    getAllBatch,
   getBatchById,
    updateBatch,
    deleteBatch,
    findBatchList,
    loginBatch,
    qrCode,
    getBatchs,
    addAllProfileId
  };