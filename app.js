var express = require('express');
var app = express();

var db = require('./mongo');

var authController = require('./auth/authController');
var userController = require('./auth/userController');
var tokenService = require('./auth/token');
app.use(tokenService.validateApiSecurity);
app.use('/auth', authController);
app.use('/users', userController);

module.exports = app;