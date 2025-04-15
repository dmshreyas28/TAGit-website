const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    departments: [{
        name: String,
        description: String
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    facilities: [{
        type: String
    }],
    isPartner: {
        type: Boolean,
        default: false
    },
    partnershipDetails: {
        startDate: Date,
        endDate: Date,
        agreement: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hospital', hospitalSchema); 