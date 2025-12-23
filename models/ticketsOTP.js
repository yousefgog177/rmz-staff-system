const mongoose = require("mongoose");

const token = new mongoose.Schema({

_id: { type: String , required: true },
ownerID: { type: String , required: true },

code: { type: String , required: true },

expire_at: { type: Number , required: true },

}, {
timestamps: true
});

module.exports = (connection) => connection.model('otp', token, 'otp');