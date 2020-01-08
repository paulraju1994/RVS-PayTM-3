var express = require('express');
var app=express()
var bodyparser = require('body-parser');
app.use(bodyparser.json());


/* Firebase service account permissions code */
var admin = require("firebase-admin");
/* import the config json file which is generated as private key from firebase*/
var serviceAccount = require("./config/config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://paytm-rvs.firebaseio.com"
});

/* Routing configurations */
var routes=require('./router/routes');
app.use('/api',routes);

/* Listening to port */
const port = process.env.PORT || 8080;
app.listen(port);
console.log("Listening to port:8080...\nRunning...");









// // load html file
// app.get('/login.html', function (req, res) {
//   res.sendFile("login.html", { root: __dirname } );
// })


// app.get('/get_user', function (req, res) {
//   // Prepare output in JSON format
//   response = {
//       ResponseCode: 200,
//      FirstName:req.query.first_name,
//      LastName:req.query.last_name
//   };
//   console.log(response);
//   res.end(JSON.stringify(response));
// })


// // Create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.post('/process_post', urlencodedParser, function (req, res) {
//   // Prepare output in JSON format
//   response = {
//      first_name:req.body.first_name,
//      last_name:req.body.last_name
//   };
//   console.log(response);
//   res.end(JSON.stringify(response));
// })

// // List all users in json
// app.get('/listUsers', function (req, res) {
//   fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {
//      console.log( data );
//      res.end( data );
//   });
// })


// // Add user to existing json data
// var user = {
//   "user4" : {
//      "FirstName" : "mohit",
//      "LastName" : "mohit",
//      "Password" : "password4",
//      "id": 4
//   }
// }
// app.post('/addUser', function (req, res) {
//   // First read existing users.
//   fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {
//      data = JSON.parse( data );
//      data["user4"] = user["user4"];
//      console.log( data );
//      res.end( JSON.stringify(data));
//   });
// })

// // Fetch user details from json with id
// app.get('/:id', function (req, res) {
//   // First read existing users.
//   fs.readFile( __dirname + "/" + "JSON/users.json", 'utf8', function (err, data) {
//      var users = JSON.parse( data );
//      var user = users["user" + req.params.id] 
//      console.log( user );
//      res.end( JSON.stringify(user));
//   });
// })

// // This responds with "Hello World" on the homepage
// app.get('/', function (req, res) {
//   res.send('Hello World');
// })

// // This responds a POST request for the homepage
// app.post('/', function (req, res) {
//   console.log("Got a POST request for the homepage");
//   res.send('Hello POST');
// })
// app.get('/register', function (req, res) {
//   res.send('Register Page');
// })
// app.get('/login', function (req, res) {
//   res.send('Login Page');
// })

// var server = app.listen(8080, function () {
//    var host = server.address().address
//    var port = server.address().port
   
//    console.log("Example app listening at http://%s:%s", host, port)
// })