const path = require('path');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));


const User = require('../models/user');

// exports.getSignup=(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"../",'views','index.html'))
// }

exports.postSignup=async (req,res,next)=>{
    try{
        var name=req.body.name;
        var email=req.body.email;
        var password=req.body.password;
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)
            await User.create({ name, email, password: hash })
            res.status(201).json({message: 'Successfuly create new user'})
        })
    }
    catch(err){
        res.status(500).json({
            error:"Email Aldready exists"
        })
    }
}

// exports.getLogin=(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"../",'views','login.html'))
// }

exports.postLogin=async (req,res,next)=>{
    try{
        var email=req.body.email;
        var password=req.body.password;
        const user  = await User.findAll({ where : { email }})
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                 throw new Error('Something went wrong')
                }
                 if(result === true){
                     return res.status(200).json({success: true, message: "User logged in successfully"})
                 }
                 else{
                 return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
             })
        }
        else{
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }
    catch(err){
        res.status(500).json({
            error:"User not found"
        })
    }
}