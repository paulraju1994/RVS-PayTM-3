var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/transaction-details */
route.post('/transaction-details', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        let transactionRequest = request.body;
        if (transactionRequest.TransactionID) {
            let checkTransactionExistence = await helperObject.checkTransactionId(transactionRequest.TransactionID);
            /* Check if the transaction id exists in table */
            if (checkTransactionExistence) {
                const transactionRef = db.collection('Transactions').doc(JSON.stringify(transactionRequest.TransactionID));
                transactionRef.get().then(async (transactionSnap) => {
                    if (transactionSnap.exists) {
                        if (transactionSnap.data().SenderName === transactionRequest.MobileNumber ||
                            transactionSnap.data().ReceiverName === transactionRequest.MobileNumber) {
                            var details = {
                                UserName: transactionSnap.data().UserName,
                                SenderName: transactionSnap.data().SenderName,
                                ReceiverName: transactionSnap.data().ReceiverName,
                                TransactionDate: transactionSnap.data().TransactionDate,
                                TransactionID: transactionSnap.data().TransactionID,
                                IsSender: false
                            };
                            return resolve({ Message: 'Details fetched successfuly', Data: details, Status: 'SUCCESS' });
                        } else {
                            return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                        }

                    } else {
                        return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                    }
                });
            } else {
                return reject({ Message: 'Invalid request', Status: 'FAILURE' });
            }
        } else {
            return reject({ Message: 'Invalid request', Status: 'FAILURE' });
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
