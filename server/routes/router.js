const express = require('express');
const route = express.Router()
const userController = require('../controller/userController');
const questionController = require('../controller/questionController');
const loginController = require('../controller/loginController');
const isAuthorized = require('../middlewares/isAuthorization')
const voteController = require('../controller/voteController')

//API for User Login
route.post('/users/login', loginController.login);

// API for Users
route.post('/users/sign-up',userController.create);
route.get('/users', isAuthorized(), userController.find);
route.put('/users/:id', isAuthorized(),userController.update);
route.delete('/users/:id', isAuthorized(),userController.delete);

// API for Questions
route.post('/addquestion', isAuthorized(), questionController.create);
route.get('/questions', isAuthorized(), questionController.find);
route.get('/questions/categories', isAuthorized(), questionController.findByCategories);
route.put('/questions/:id', isAuthorized(), questionController.update);
route.delete('/questions/:id', isAuthorized(), questionController.delete);

//Upvote and DownVote
route.put('/questions/:questionId/upvote', isAuthorized(), voteController.upVote);
route.put('/questions/:questionId/downvote', isAuthorized(), voteController.downVote);


module.exports = route