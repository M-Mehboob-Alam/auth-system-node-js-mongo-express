const jwt = require('jsonwebtoken');
require('dotenv').config();
// middlewares for auth isStudent isAdmin
exports.auth = (req, res, next) => {
    try {
        console.log('body', req.body.token);
        console.log('cookie', req.cookies.token);
        console.log('bearer', req.header('Authorization'));
        const token = req.body.token || req.cookies.token|| req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
                data: null,
            });
        }

        try {
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            console.log(decoded);
            if (!decoded) {
                return res.status(500).json({
                    success: false,
                    message: 'Token is not decoding',
                    data: null,
                });
            }
            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token expired',
                        data: null,
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token',
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Error while decoding token',
                    data: error.message || 'Unknown error',
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while verifying authentication token',
            data: null,
        });
    }
};

exports.isAdmin = (req,res, next)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                success: false,
                message: 'you are not authorized to access this route admin can access',
                data : 'you are not authorized to access this route admin can access',
            });
        }
        next();
           
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error while verifying admin',
            data : 'error while verifying admin',
        });
    }
   
}