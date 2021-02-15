const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
    balance: {
        type: Number,
        default: 0
    },
    friends: {
        type: Array,
    },
    name: {
        type: String,
    },
    email: {
        type: String
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;