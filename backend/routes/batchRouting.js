const express = require('express');
const router = express.Router();
const {
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
} = require('../controller/batchesBookingController');
const { isAuth, isAdmin } = require('../config/auth');

router.post('/add',isAuth, addBatch);
router.post('/get',isAuth, getBatchs);
router.post('/login', loginBatch);
router.post('/listbyprofileid',isAuth, getBatchById);
router.put('/:id',isAuth, updateBatch);
router.post('/all',isAuth, addAllBatch);
router.post('/find',isAuth, findBatchList);
router.get('/list', getAllBatch);
router.get('/:id', getBatchById);
router.get('/qr/:id', qrCode);
router.delete('/:id',isAuth, deleteBatch);
module.exports = router;