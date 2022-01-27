const mongoose = require('mongoose');

//validering

const Joi = require('@hapi/Joi');

const Schema = {
    name: Joi.string()
    .min(6)
    .required(),
    email: Joi.string()
    .min(6)
    .required()
    .email(),
    password: Joi.string()
    .min(6)
    .required()
};

const userSchema = new mongoose.Schema({
    name: {  
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    email:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date:{
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', userSchema);