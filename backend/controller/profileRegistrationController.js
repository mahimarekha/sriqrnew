const ProfileRegistration = require('../models/ProfileRegistration');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');

dayjs.extend(utc);

const addProfileRegistration = async (req, res) => {
    try {
      const isEmailAdded = await ProfileRegistration.findOne({ email: req.body.email });
      if (isEmailAdded) {
        return res.status(403).send({
          message: 'This Mobile or Email already Added!',
        });
      }else{
        req.body.password = bcrypt.hashSync(req.body.password);
        req.body.role ="client";
        const newProfileRegistration= new ProfileRegistration(req.body);
        await newProfileRegistration.save();
        res.send({ message: 'Registration Added Successfully!' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
  const loginProfileRegistration = async (req, res) => {
    try {
      
      const profileRegistration = await ProfileRegistration.findOne({ email: req.body.email });
      console.log(profileRegistration)
      if (profileRegistration && bcrypt.compareSync(req.body.password, profileRegistration.password)) {
        const token = signInToken(profileRegistration);
        res.send({
          token,
          email:profileRegistration.email,
          _id : profileRegistration._id,
           role:profileRegistration.role,
          profileId: profileRegistration._id, 
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
  const addAllProfileRegistration = async (req, res) => {
    try {
      req.body.role = 'client';
      await ProfileRegistration.insertMany(req.body);
      res.status(200).send({
        message: 'Registration Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const getAllProfileRegistration = async (req, res) => {
    
    try {
      const profileRegistration = await ProfileRegistration.find({});
      res.send(profileRegistration);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
const findProfileRegistrationList=async(req, res)=>{
  let preparePost ={};
  try {
    const profileRegistration = await ProfileRegistration.find(preparePost)
    res.send(profileRegistration);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}
  const getProfileRegistrationById = async (req, res) => {
    try {
      const profileRegistration = await ProfileRegistration.findById(req.params.id);
      res.send(profileRegistration);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateProfileRegistration = async (req, res) => {
    try {
      const profileRegistration = await ProfileRegistration.findById(req.params.id);
      if (profileRegistration) {
        profileRegistration.location = req.body.location;
        profileRegistration.name = req.body.name;
        profileRegistration.email = req.body.email;
        profileRegistration.mobileNumber1 = req.body.mobileNumber1;
        profileRegistration.mobileNumber2 = req.body.mobileNumber2;
        profileRegistration.password = req.body.password;
        await profileRegistration.save();
        res.send({ message: 'Registration Updated Successfully!' });
      }
    } catch (err) {
      res.status(404).send({ message: 'Registration not found!' });
    }
  };
  const deleteProfileRegistration = (req, res) => {
    ProfileRegistration.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Registration Deleted Successfully!',
        });
      }
    });
  };

  module.exports = {
    addProfileRegistration,
    addAllProfileRegistration,
    getAllProfileRegistration,
    getProfileRegistrationById,
    updateProfileRegistration,
    deleteProfileRegistration,
    findProfileRegistrationList,
    loginProfileRegistration,
  };