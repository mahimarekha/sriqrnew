const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addPark, addAllPark, getAllPark, updatePark,deletePark,findParkList,
     getParkById, loginPark, qrCode, addAllProfileId, getParks
} = require('../controller/parkController');
router.post('/add', addPark);
router.post('/get', getParks);
router.post('/login', loginPark);
router.post('/listbyprofileid',isAuth, addAllProfileId);
router.put('/:id',isAuth, updatePark);
router.post('/all',isAuth, addAllPark);
router.post('/find',isAuth, findParkList);
router.get('/list', getAllPark);
router.get('/:id', getParkById);
router.get('/qr/:id', qrCode);
module.exports = router;