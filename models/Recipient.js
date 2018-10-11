const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientySchema = new Schema({
    email: String,
    responded: { type: Boolean, default: false }
});

module.exports = recipientySchema;