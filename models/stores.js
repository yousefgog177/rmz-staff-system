
const mongoose = require("mongoose");

const token = new mongoose.Schema({

    _id: { type: Number, required: true },

    rmz_key: { type: String, required: true },
    ownerID: { type: String, required: true },

}, {
    timestamps: true
});

module.exports = (connection) => connection.model('stores', token, 'stores');