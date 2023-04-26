let  jwt = require('jsonwebtoken');
let userModel = require('../models/userModel');
let configs = require('../config/config');
const { config } = require('dotenv');


let createJWT = async (req, res, next)=>{
    try{
        //console.log('in createJWT')
        const profile = req.user;
       // console.log(profile)
        let user_data = await userModel.find({user_email: profile.emails[0].value});
       // console.log(user_data)
        const token = jwt.sign(
            { role: user_data[0].user_role, name: user_data[0].user_first_name + " " + user_data[0].user_last_name, email:user_data[0].user_email, user_id:user_data[0]._id },
            process.env.SECRET_KEY || configs.SECRET_KEY,
            { expiresIn: "1h" })
            res.cookie("jwt", token, {
                        httpOnly: true,
                     });
        next()
    } catch(err){
        res.send({error: err.message})
    }
}

module.exports = createJWT