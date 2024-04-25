const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 8000;

// processing request bodies
app.use(express.json());
// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// connection db
const dbConnect = require('./config/database');
dbConnect();

// getting routes
const user = require('./routes/user');
// mounting routes
app.use('/api/v1', user);
// starting server and listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
