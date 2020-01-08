var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
app.use(express.static('public'));
// load html fileapp.get('/login.html', function (req, res) {  res.sendFile("login.html", { root: __dirname } );})

// app.get('/get_user', function (req, res) {
      // Prepare output in JSON format  response = {      ResponseCode: 200,     FirstName:req.query.first_name,     LastName:req.query.last_name  };  console.log(response);  res.end(JSON.stringify(response));})

// Create application/x-www-form-urlencoded parservar urlencodedParser = bodyParser.urlencoded({ extended: false })app.post('/process_post', urlencodedParser, function (req, res) {  // Prepare output in JSON format  response = {     first_name:req.body.first_name,     last_name:req.body.last_name  };  console.log(response);  res.end(JSON.stringify(response));})
// List all users in jsonapp.get('/listUsers', function (req, res) {  fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {     console.log( data );     res.end( data );  });})

// Add user to existing json datavar user = {  "user4" : {     "FirstName" : "mohit",     "LastName" : "mohit",     "Password" : "password4",     "id": 4  }}app.post('/addUser', function (req, res) {  // First read existing users.  fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {     data = JSON.parse( data );     data["user4"] = user["user4"];     console.log( data );     res.end( JSON.stringify(data));  });})
// Fetch user details from json with idapp.get('/:id', function (req, res) {  // First read existing users.  fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {     var users = JSON.parse( data );     var user = users["user" + req.params.id]      console.log( user );     res.end( JSON.stringify(user));  });})
// This responds with "Hello World" on the homepageapp.get('/', function (req, res) {  res.send('Hello World');})
// This responds a POST request for the homepageapp.post('/', function (req, res) {  console.log("Got a POST request for the homepage");  res.send('Hello POST');})app.get('/register', function (req, res) {  res.send('Register Page');})app.get('/login', function (req, res) {  res.send('Login Page');})
var server = app.listen(8080, function () {   
    var host = server.address().address;
       var port = server.address().port ;
         console.log("Example app listening at http://%s:%s", host, port)
});