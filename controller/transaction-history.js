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
        let userSession = await helperObject.checkUserSession(transactionRequest.MobileNumber);
        if (userSession) {
            transactionList = [];
            i = 0;

            if (transactionRequest.MobileNumber) {
                const transactionRef = db.collection('Transactions');
                await transactionRef.get().then((snapshot) => {
                    snapshot.docs.forEach(element => {
                        if ((transactionRequest.MobileNumber === element.data().SenderName) ||
                            (transactionRequest.MobileNumber === element.data().ReceiverName)) {
                            transactionList[i++] = element.data();
                        }
                    })
                })
                resolve(transactionList);
            } else {
                reject('no-transaction');
            }
        } else {
            reject('out-of-session');
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
            if(err === 'out-of-session'){
                response.send({ Message: 'Out of session', Data: [], Status: 'SUCCESS' });
            } else {
                response.send({ Message: 'No Transactions yet', Data: [], Status: 'SUCCESS' });
            }
            
        });
});


module.exports = route;
