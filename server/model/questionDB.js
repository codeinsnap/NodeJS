const mongoose = require('mongoose');

const Questions = new mongoose.Schema({
    questionId:{
        type: String,
        required: true,
        unique: true
    },
    body : {
        type : String,
        required: true
    },
    categories : {
        type: Array,
        required: true
    },
    replies : {
        type : Array,
    },
    votes : {
        type : Number
    },
    createdOn : {
        type : String,
        required: true
    },
    createdBy : {
        type : String,
        required: true
    },
    updatedOn : {
        type : String,
        required: true
    },
    updatedBy : {
        type : String,
        required: true
    }
})

const Questionsdb = mongoose.model('Questions', Questions);

module.exports = Questionsdb;
