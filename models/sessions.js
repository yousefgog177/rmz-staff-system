const mongoose = require("mongoose");

const token = new mongoose.Schema({

_id: { type: String , required: true },

token: { type: String , required: true },
ownerID: { type: String , required: true },

expire_at: { type: Number , required: true },

details: { type: Object , required: true },

}, {
timestamps: true
});

module.exports = (connection) => connection.model('sessions', token, 'sessions');