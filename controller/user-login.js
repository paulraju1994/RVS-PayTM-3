var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/login */
route.post('/login', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var loginuser = request.body;
        /* Check for mandatory fields */
        if (loginuser.MobileNumber && loginuser.Password) {
            var mobileNumber = loginuser.MobileNumber;
            const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
            let checkExistence = await helperObject.checkDocId(mobileNumber);
            /* Check if the doc id exists in DB */
            if (checkExistence) {
                userRef.get().then((snapshot) => {
                    /* Check if the user exists in DB */
                    if (snapshot.exists) {
                        /* Verify the values in DB with input values */
                        if (snapshot.data().MobileNumber == loginuser.MobileNumber
                            && snapshot.data().Password == loginuser.Password
                            && snapshot.data().IsAdmin == loginuser.IsAdmin && loginuser.IsAdmin == true) {
                            return resolve({ MESSAGE: 'Admin logged in successfully', STATUS: 'SUCCESS' });
                        } else if (snapshot.data().MobileNumber == loginuser.MobileNumber
                            && snapshot.data().Password == loginuser.Password
                            && snapshot.data().IsAdmin == loginuser.IsAdmin && loginuser.IsAdmin == false) {
                            return resolve({ MESSAGE: 'User logged in successfully', STATUS: 'SUCCESS' });
                        } else {
                            return reject({ MESSAGE: 'Please enter a valid credentials', STATUS: 'FAILURE' });
                        }
                    } else {
                        return reject({ MESSAGE: 'Please enter a valid credentials', STATUS: 'FAILURE' });
                    }

                });
            } else {
                reject({ Message: 'User not found', Status: 'FAILURE' });
            }
        } else {
            return reject({ Message: 'Please enter a valid credentials', Status: 'FAILURE' });
        }
    })
        .then(result => {
            response.send(result);
        })
        .catch(err => {
            response.send(err);
        });
});

module.exports = route;