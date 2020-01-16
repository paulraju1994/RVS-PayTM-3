var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/add-money */
route.post('/add-money', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var userRequest = request.body;

        if (userRequest.MobileNumber) {
            if (Number.isInteger(userRequest.MobileNumber) == false || Number.isInteger(userRequest.Amount) == false) {
                reject({ Message: 'Please enter valid details', Status: 'FAILURE' });
            } else {
                const userRef = db.collection('Users').doc(JSON.stringify(userRequest.MobileNumber));
                let checkExistence = await helperObject.checkDocId(userRequest.MobileNumber);
                if (checkExistence) {
                    let checkCredentials = helperObject.checkUserCredentials(userRequest.MobileNumber, userRequest.Password);
                    if (checkCredentials) {
                        let currentBalance = await userRef.get().then((snapshot) => {
                            return JSON.parse(snapshot.data().AccountBalance);
                        });
                        userRef.update({ AccountBalance: currentBalance + userRequest.Amount });
                        resolve({ Message: 'Successfully added the amount to your account', Status: 'SUCCESS' });

                    } else {
                        reject({ Message: 'Please enter valid credentials', Status: 'FAILURE' });
                    }
                } else {
                    reject({ Message: 'Please enter valid credentials', Status: 'FAILURE' });
                }
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