var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');

route.post('/login', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var loginuser = request.body;
        var mobileNumber = loginuser.MobileNumber;
        const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
        let checkExistence = await helperObject.checkDocId(mobileNumber);
        if (checkExistence) {
            userRef.get().then((snapshot) => {
                if (snapshot.exists) {
                    if (snapshot.data().MobileNumber == loginuser.MobileNumber
                        && snapshot.data().Password == loginuser.Password
                        && snapshot.data().IsAdmin == loginuser.IsAdmin && loginuser.IsAdmin == true) {
                        return resolve({ Message: 'Admin logged in successfully', Status: 'SUCCESS' });
                    } else if (snapshot.data().MobileNumber == loginuser.MobileNumber
                        && snapshot.data().Password == loginuser.Password
                        && snapshot.data().IsAdmin == loginuser.IsAdmin && loginuser.IsAdmin == false) {
                        return resolve({ Message: 'User logged in successfully', Status: 'SUCCESS' });
                    } else {
                        return reject({ Message: 'Wrong credentials', Status: 'FAILURE' });
                    }
                } else {
                    return reject({ Message: 'Wrong credentials', Status: 'FAILURE' });
                }

            });
        } else {
            if (request.body.IsAdmin) {
                reject({ Message: 'Admin not found', Status: 'FAILURE' });
            } else {
                reject({ Message: 'User not found', Status: 'FAILURE' });
            }

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