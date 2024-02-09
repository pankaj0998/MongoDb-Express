const mongoose = require('mongoose');


const headerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    keyItem: {
        type: String,
        required: true,
    },
    valueItem: {
        type: String,
        required: true,
    },
}, {
    _id: false
});

const endpointSchema = new mongoose.Schema({
    reqMethod: {
        type: String,
        required: true,
    },
    apiName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    headers: [headerSchema],
    description: {
        type: String,
        required: true,
    },
}, {
    _id: false
});


const dataSchema = mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    endpoints: [endpointSchema]
})

module.exports = mongoose.model('Collection', dataSchema);