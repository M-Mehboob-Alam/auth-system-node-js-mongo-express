const express = require('express');
const bcrypt = require('bcrypt');
const User= require('../models/User');

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