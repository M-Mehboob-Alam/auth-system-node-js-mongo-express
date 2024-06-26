const mongoose = require('mongoose');

const user = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    readPassword: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['Student', 'Admin', 'Visitor'],
    }
});


module.exports = mongoose.model('User', user);  