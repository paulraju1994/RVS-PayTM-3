var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
var transactionList = [];
var i = 0;
/* API triggered on calling api/user/transaction-history */
route.post('/transaction-history', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        let transactionRequest = request.body;
        transactionRequest.MobileNumber = JSON.parse(transactionRequest.MobileNumber);
        if (transactionRequest.MobileNumber) {
            const transactionRef = db.collection('Transactions');
            await transactionRef.get().then((snapshot) => {
                snapshot.docs.forEach(element => {
                    if ((transactionRequest.MobileNumber === element.data().Sender) ||
                        (transactionRequest.MobileNumber === element.data().Receiver)) {
                            transactionList[i++] = element.data();
                    }
                })
            })
            resolve(transactionList);
        } else {
            return reject({ Message: 'Invalid request', Status: 'FAILURE' });
        }
    })
        .then(result => {
            if (transactionList == '') {
                response.send({ Message: 'No Transactions yet', Data: [], Status: 'SUCCESS' });
            }
            else {
                response.send({ Message: 'Details fetched successfuly', Data: result, Status: 'SUCCESS' });
                transactionList = [];
            }
        })
        .catch(err => {
            response.send({ Message: 'No Transactions yet', Data: result, Status: 'SUCCESS' });
        });
});


module.exports = route;
