var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');

route.post('/register', async (request, response) => {
    return new Promise( async (resolve, reject) => {
        var registerUser = request.body;
        var mobileNumber = registerUser.MobileNumber;
        const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
        let checkExistence = await helperObject.checkDocId(mobileNumber);
        if(!checkExistence) {
            userRef.set({IsAdmin : false, MobileNumber : mobileNumber, Password : 'password01'});
            return resolve({ Message: 'Thank you for registering in RVS PayTM', Status: 'SUCCESS' });
        } else {
            return reject({ Message: 'User already exists', Status: 'FAILURE' });
        }
    }).then(result => {
        response.send(result);
    })
    .catch(err => {
        response.send(err);
    });;
});

module.exports = route;