const TicketBooking = require('../models/TicketBooking');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');
dayjs.extend(utc);
const addTicketBooking = async (req, res) => {
    try {
      const newTicketBooking = new TicketBooking(req.body);
      await newTicketBooking.save();
      res.status(200).send({
        message: 'TicketBooking Added Successfully!',
      });
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
      let preparePost ={};
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
  };