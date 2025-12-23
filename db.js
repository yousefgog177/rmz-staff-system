const events = require('events');
const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');

class Database extends events {
    constructor() {
        super();

        this.connection_uri = config.MONGODB_URI;
        this.connection = mongoose.createConnection(this.connection_uri, {});

        this.users = require('./models/users.js')(this.connection)

        this.sessions = require('./models/sessions.js')(this.connection)
        this.ticketsOTP = require('./models/ticketsOTP.js')(this.connection)
        this.stores = require('./models/stores.js')(this.connection)
        this.invites = require('./models/invites.js')(this.connection)

        this._listenForEvents();
    }

    hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex')
    }

    onConnecting() {
        console.log("[DATABASE] Connecting...");
    }

    onConnected() {
        console.log("[DATABASE] Connected!");
    }


    onDisconnecting() {
        console.log("[DATABASE] Disconnecting...");
    }

    onDisconnected() {
        console.log("[DATABASE] Disconnected!");
    }

    onError(err) {
        console.error(`[DATABASE] Error: ${err.stack}`);
    }

    onReconnected() {
        console.log("[DATABASE] Reconncted!");
    }

    _listenForEvents() {
        this.connection.on("connecting", this.onConnecting.bind(this));
        this.connection.on("connected", this.onConnected.bind(this));
        this.connection.on("disconnecting", this.onDisconnecting.bind(this));
        this.connection.on("disconnected", this.onDisconnected.bind(this));
        this.connection.on("error", this.onError.bind(this));
        this.connection.on("reconnected", this.onReconnected.bind(this));
    }

}

module.exports = Database;