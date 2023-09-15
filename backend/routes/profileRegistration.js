const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addProfileRegistration,addAllProfileRegistration,getAllProfileRegistration,getProfileRegistrationById,
    updateProfileRegistration,deleteProfileRegistration,findProfileRegistrationList,
    loginProfileRegistration
} = require('../controller/profileRegistrationController');

//add a coupon
router.post('/add', addProfileRegistration);
router.post('/login', loginProfileRegistration);
//add multiple coupon
router.post('/all',isAuth, addAllProfileRegistration);

router.post('/find',isAuth, findProfileRegistrationList);
//get all coupon
router.get('/',isAuth, getAllProfileRegistration);

//get a coupon
router.get('/:id',isAuth, getProfileRegistrationById);

//update a coupon
router.put('/:id',isAuth, updateProfileRegistration);
module.exports = router;

