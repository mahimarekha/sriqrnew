const Park = require('../models/Park');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
var QRCode = require('qrcode')
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');
dayjs.extend(utc);
const addPark = async (req, res) => {
    try {
      const newPark = new Park(req.body);
      await newPark.save();
      res.status(200).send({
        message: 'Park Added Successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const loginPark = async (req, res) => {
    try {
      console.log(req.body.email)
  
      const park = await Park.findOne({ parkEmail: req.body.email });
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
  const addAllPark = async (req, res) => {
    try {
      await Park.insertMany(req.body);
      res.status(200).send({
        message: 'Park Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
 
  const getAllPark = async (req, res) => {
    try {
      let preparePost ={};
      const park = await Park.find(preparePost);
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  
  const getParkName = async (req, res) => {
    try {
      let preparePost ={};
      const park = await Park.find(preparePost);
      
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
const findParkList=async(req, res)=>{
  let preparePost ={};
  try {
    const park = await Park.find(preparePost);
    res.send(park);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
  const getParkById = async (req, res) => {
    console.log(req.params.id)
    try {
      let park = await Park.findById(req.params.id);
      if (!park) {
        park = []; 
      }
      console.log(park)
      res.send(park);
     
    } catch (err) {
      
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updatePark = async (req, res) => {
    try {
      console.log(req.params.id)
      const park = await Park.findById(req.params.id);
      if (park) {
        park.parkName = req.body.parkName;
        park.location = req.body.location;
        park.adult = req.body.adult;
        park.child = req.body.child;
        park.adultFee = req.body.adultFee;
        park.childFee = req.body.childFee;
        park.isCloakRoom = req.body.isCloakRoom;
        park.isHolidays = req.body.isHolidays;
        park.holidayDays = req.body.holidayDays;
        park.seniorCitizen = req.body.seniorCitizen;
        park.seniorCitizenFee = req.body.seniorCitizenFee;
        park.women = req.body.women;
        park.womenFee = req.body.womenFee;
        park.physicallyChallenged = req.body.physicallyChallenged;
        park.physicallyChallengedFee = req.body.physicallyChallengedFee;
        park.camera = req.body.camera;
        park.cameraFee = req.body.cameraFee;
        park.photography = req.body.photography;
        park.photographyFee = req.body.photographyFee;
        park.shooting = req.body.shooting;
        park.shootingFee = req.body.shootingFee;
        park.walker = req.body.walker;
        park.walkerFee = req.body.walkerFee;
        park.startTime = req.body.startTime;
        park.endTime = req.body.endTime;
        park.note= req.body.note;
        park.profileRegistrationId= req.body.profileRegistrationId;
        await park.save();
        res.send({ message: 'Park Updated Successfully!' });
      }
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
  const deletePark = (req, res) => {
    Park.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Park Deleted Successfully!',
        });
      }
    });
  };

  const qrCode = async(req, res) =>{
   
    const id=req.params.id;
    QRCode.toDataURL(`http://localhost:3000/#/ticketbooking/${id}`, function (err, url) {
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
      const park = await Park.find(preparePost).populate("profileRegistrationId");
      res.send(park);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  module.exports = {
    addPark,
    getParkName,
     addAllPark,
    getAllPark,
   getParkById,
    updatePark,
    deletePark,
    findParkList,
    loginPark,
    qrCode,
    addAllProfileId
  };