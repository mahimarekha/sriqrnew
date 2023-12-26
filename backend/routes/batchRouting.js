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
const {  isAdmin } = require('../config/auth');

router.post('/add', addBatch);
router.post('/get', getBatchs);
router.post('/login', loginBatch);
router.post('/listbyprofileid', getBatchById);
router.put('/:id', updateBatch);
router.post('/all', addAllBatch);
router.post('/find', findBatchList);
router.get('/list', getAllBatch);
router.get('/:id', getBatchById);
router.get('/qr/:id', qrCode);
router.delete('/:id', deleteBatch);
module.exports = router;