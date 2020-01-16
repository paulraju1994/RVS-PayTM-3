var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/send-money */
route.post('/send-money', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var userRequest = request.body;

        if (userRequest.SenderNumber) {
            if (Number.isInteger(userRequest.SenderNumber) == false || 
            Number.isInteger(userRequest.Amount) == false ||
            userRequest.SenderNumber === userRequest.ReceiverNumber
            ) {
                reject({ Message: 'Please enter valid details', Status: 'FAILURE' });
            } else {                
                let senderExistence = await helperObject.checkDocId(userRequest.SenderNumber);
                let receiverExistence = await helperObject.checkDocId(userRequest.ReceiverNumber);
                if (senderExistence && receiverExistence) {
                    let checkCredentials = helperObject.checkUserCredentials(userRequest.MobileNumber, userRequest.Password);
                    if (checkCredentials) {
                        const senderRef = db.collection('Users').doc(JSON.stringify(userRequest.SenderNumber));
                        const receiverRef = db.collection('Users').doc(JSON.stringify(userRequest.ReceiverNumber));
                        let senderCurrentBalance = await senderRef.get().then((snapshot) => {
                            return JSON.parse(snapshot.data().AccountBalance);
                        });
                        let receiverCurrentBalance = await receiverRef.get().then((snapshot) => {
                            return JSON.parse(snapshot.data().AccountBalance);
                        });
                        if(senderCurrentBalance >= userRequest.Amount){
                            senderRef.update({ AccountBalance: senderCurrentBalance - userRequest.Amount });
                            receiverRef.update({ AccountBalance: receiverCurrentBalance + userRequest.Amount });
                            resolve({ Message: 'Successfully added the amount to your account', Status: 'SUCCESS' });
                        } else {
                            reject({ Message: 'Insufficient balance in your account ', Status: 'FAILURE' });
                        }
                        

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