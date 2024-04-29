const express = require('express');
const router = express.Router();

const { signup, login, sendEmail} = require('../controller/Auth');
const { isAdmin, isStudent, auth } = require('../middlewares/Auth');

router.post('/login', login);
router.post('/signup', signup);
router.get('/sendEmail',auth, sendEmail);
router.get('/test/auth/route', auth,isAdmin, (req, res)=>{
    return res.status(200).json({
        success: true,
        message: 'welcome to auth route protected for admin',
        
        })
 });



module.exports = router;