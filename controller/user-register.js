var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/register  */
route.post('/register', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var registerUser = request.body;
        var mobileNumber = registerUser.MobileNumber;
        const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
        let checkExistence = await helperObject.checkDocId(mobileNumber);
        /* Check if the user already exists or not */
        if (!checkExistence) {
            /* Enter the input values to user table in DB */
            userRef.set({ IsAdmin: false, MobileNumber: mobileNumber, Password: 'password01' });
            return resolve({ MESSAGE: 'Thank you for registering in RVS PayTM', STATUS: 'SUCCESS' });
        } else {
            return reject({ MESSAGE: 'User already exists', STATUS: 'FAILURE' });
        }
    }).then(result => {
        response.send(result);
    })
        .catch(err => {
            response.send(err);
        });;
});

module.exports = route;