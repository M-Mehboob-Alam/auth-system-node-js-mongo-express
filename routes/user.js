const express = require('express');
const router = express.Router();

const { signup} = require('../controller/Auth');

// router.post('/login', login);
router.post('/signup', signup);

module.exports = router;