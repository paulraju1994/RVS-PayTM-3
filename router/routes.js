const route=require('express').Router();

/* Routing of pages */
// var adminLogin = require('../controller/admin-login');
var userRegister = require('../controller/user-register');
var userLogin = require('../controller/user-login');
// var logout = require('../controller/logout');

// var userListing = require('../controller/user-listing');
// var transactionHistory = require('../controller/transaction-history');
// var transactionDetails = require('../controller/transaction-details');

// var addMoney = require('../controller/add-money');
// var sendMoney = require('../controller/send-money');

/* Navigation of pages based on URL */
// route.use('/admin',adminLogin);
// route.use('/admin',logout);
// route.use('/admin',transactionDetails);

route.use('/user',userRegister);
route.use('/user',userLogin);
// route.use('/user',logout);

// route.use('/user',transactionHistory);
// route.use('/user',addMoney);
// route.use('/user',sendMoney);

// route.use('/users-listing',userListing);

module.exports=route;