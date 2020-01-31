var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/login */
route.post('/login', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var loginUser = request.body;
        /* Check for mandatory fields */
        if (loginUser.MobileNumber && loginUser.Password) {
            var mobileNumber = loginUser.MobileNumber;            
            let checkExistence = await helperObject.checkDocId(mobileNumber);
            /* Check if the doc id exists in DB */
            if (checkExistence) {
                const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
                userRef.get().then((snapshot) => {
                    /* Check if the user exists in DB */
                    if (snapshot.exists) {
                        /* Verify the values in DB with input values */
                        if (snapshot.data().MobileNumber == loginUser.MobileNumber
                            && snapshot.data().Password == loginUser.Password
                            && snapshot.data().IsAdmin == loginUser.IsAdmin && loginUser.IsAdmin == true) {
                            return resolve({ Message: 'Admin logged in successfully', Status: 'SUCCESS' });
                        } else if (snapshot.data().MobileNumber == loginUser.MobileNumber
                            && snapshot.data().Password == loginUser.Password
                            && snapshot.data().IsAdmin == loginUser.IsAdmin && loginUser.IsAdmin == false) {
                            return resolve({ Message: 'User logged in successfully', Status: 'SUCCESS' });
                        } else {
                            return reject({ Message: 'Please enter a valid credentials', Status: 'FAILURE' });
                        }
                    } else {
                        return reject({ Message: 'Please enter a valid credentials', Status: 'FAILURE' });
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
            // response.send(err);
        });
});

module.exports = route;