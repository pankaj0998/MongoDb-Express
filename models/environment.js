const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    variableName: {
        type: String,
        required: true,
    },
    variableValue: {
        type: String,
        required: true,
    },
}, {
    _id: false
});


const environmentSchema = mongoose.Schema({
    environmentName: {
        type: String,
        required: true
    },
    variables: [variableSchema]
});


module.exports = mongoose.model('Environment', environmentSchema);