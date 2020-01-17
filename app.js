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
