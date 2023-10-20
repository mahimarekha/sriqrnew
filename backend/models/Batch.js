const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const batchSchema = new mongoose.Schema(
    {
        batchName: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        fee: {
            type: String,
            required: true,
        },
        inTake: {
            type: String,
            required: true,
        },
        profileRegistrationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProfileRegistration",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);

module.exports = Batch;
