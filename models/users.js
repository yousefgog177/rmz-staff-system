
let mongoose = require("mongoose");

const token = new mongoose.Schema({

    _id: { type: String, required: true },

    email: { type: String, required: true },
    storeID: { type: Number, default: null },

    password: { type: String, default: null },

    permissions: { type: Object, default: {
        see_orders: false,
        see_order: false,
        create_order: false,
        update_order: [],

        products_list: false,
        product_details: false,

        categories_list: false,

        subscriptions_list: false,
        subscription_details: false,

        statics: false,

        add_staff: false,
        remove_staff: false,
        see_staffs: false
    }}

}, {
    timestamps: true
});
module.exports = (connection) => connection.model('users', token, 'users');