const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    name : {
        type : String
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required: true
    },
    saveQuestions : {
        type : Array
    }
})

const Userdb = mongoose.model('Users', Users);


module.exports = Userdb;
