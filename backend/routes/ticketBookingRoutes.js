const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addTicketBooking, addAllTicketBooking, getAllTicketBooking, updateTicketBooking,
    deleteTicketBooking,findTicketBookingList, getTicketBookingById, getAllProfileId
} = require('../controller/ticketBookingController');
router.post('/add', addTicketBooking);
router.post('/profileid',isAuth, getAllProfileId);
router.put('/:id',isAuth, updateTicketBooking);
router.post('/all',isAuth, addAllTicketBooking);
router.post('/find',isAuth, findTicketBookingList);
router.get('/list',isAuth, getAllTicketBooking);
router.get('/:id', getTicketBookingById);
module.exports = router;