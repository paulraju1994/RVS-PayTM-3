var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/register  */
route.post('/register', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var registerUser = request.body;
        var mobileNumber = registerUser.MobileNumber;
        var password = registerUser.Password;
        if (registerUser.MobileNumber && registerUser.Email && registerUser.Password) {
            var passwordCondition = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
            if (!password.match(passwordCondition)) {
                /* Check for password validation */
                return reject({ Message: 'Please enter a valid password with atleast one number, one special character and min 8 characters', Status: 'FAILURE' });
            } else if (isNaN(mobileNumber) || JSON.stringify(mobileNumber).length !== 10) {
                /* Check for phone number validation */
                return reject({ Message: 'Please enter a valid phone number', Status: 'FAILURE' });
            } else {
                /* Set DB if all validations are completed */
                const userRef = db.collection('Users').doc(JSON.stringify(mobileNumber));
                let checkExistence = await helperObject.checkDocId(mobileNumber);
                /* Check if the user already exists or not */
                if (!checkExistence) {
                    /* Enter the input values to user table in DB */
                    userRef.set({ IsAdmin: registerUser.IsAdmin, MobileNumber: mobileNumber, Password: registerUser.Password, AccountBalance: registerUser.AccountBalance, Email: registerUser.Email, IsActive : true });
                    return resolve({ Message: 'Thank you for registering in RVS PayTM', Status: 'SUCCESS' });
                } else {
                    return reject({ Message: 'User already exists', Status: 'FAILURE' });
                }
            }
        }


    }).then(result => {
        response.send(result);
    })
        .catch(err => {
            response.send(err);
        });;
});

module.exports = route;