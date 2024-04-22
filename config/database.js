const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log('Connected to MongoDB');

    }).catch((err) => {
        console.log('db connection error');
        console.log(err);
        process.exit();

    });
}

module.exports = dbConnect;