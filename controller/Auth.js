const express = require('express');
const bcrypt = require('bcrypt');
const User= require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.signup = async (req, res) => {
    try {
        
        const {name, email, password,  role} = req.body;
        const isExisting = await User.findOne({email});
        if(isExisting){
            return res.status(400).json({
                success: false,
                message: 'User already exists',
                data : 'User already exists',
            });
        }
        // hashing password
        let hashingPassword;
        try {
            hashingPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'error while hashing password',
                data : error.message
            });
        }
        const user = await User.create({
            name,
            email,
            password: hashingPassword,
            readPassword:password,
            role
        });

       
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
          
            data : user
        });


    } catch (error) {
        console.log('error while registering user');
        return res.status(500).json({
            success: false,
            message: 'error while registering user',
            data : error.message
        });
    }

}

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email ||!password){
            return res.status(400).json({
                success: false,
                message: 'email and password are required',
                data : 'email and password are required',
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
                data : 'User does not exist',
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid password or email',
                data : 'Invalid password or email',
            });
        }
        let payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '12d'});
        user = user.toObject()
        user.token = token;
        user.password = undefined;
        user.readPassword = undefined;
       
        // return res.status(200).json({
        //     success: true,
        //     message: 'User logged in successfully',
        //     token:token,
        //     data : user
        // });
        let option = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            htttpOnly:true,
        }
        let decode = jwt.decode(token, process.env.JWT_SECRET);
        console.log(decode);
        res.status(200).json({
            success: true,
            token:token,
            user:user,
            message:'user loggedin successful!'
        });
        // res.cookie('token', token, option).status(200).json({
        //     success: true,
        //     token:token,
        //     user:user,
        //     message:'user loggedin successful!'
        // });

    } catch (error) {
        return  res.status(500).json({
            success: false,
            message: 'error while logging in',
            data : error.message
        });
    }
}


exports.sendEmail = async (req, res) => {
    try {
        const id = req.user.id;
        console.log('id', id);
        let user = await User.findById(id);
        user.password = undefined
        user.readPassword = undefined
        return res.status(200).json({
            success: true,
            message: 'email sent successfully',
            data : user
        }); 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'error while sending email',
            data: error.message
        })
    }
}