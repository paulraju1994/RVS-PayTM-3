var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/transaction-details */
route.post('/transaction-history', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        let transactionRequest = request.body;
        if (transactionRequest.MobileNumber) {
            // let checkTransactionExistence = await helperObject.checkTransactionId(transactionRequest.TransactionID);
            /* Check if the transaction id exists in table */
            // if (checkTransactionExistence) {
            const transactionRef = db.collection('Transactions');
            transactionRef.get().then(async (transactionSnap) => {
                // if (transactionSnap.exists) {
                if (transactionSnap && transactionSnap.docs) {
                    var transactionList = [];
                    transactionSnap.docs.forEach((element) => {
                        if ((element.data().IsSender && transactionRequest.MobileNumber === element.data().Sender) ||
                            (!element.data().IsSender && transactionRequest.MobileNumber === element.data().Receiver)) {
                            // const userRef1 = db.collection('Users').doc(JSON.stringify(transactionRequest.MobileNumber));




                            const userRef1 = db.collection('Users').doc(JSON.stringify(element.data().Sender));
                            userRef1.get().then((userSnap1) => {
                                if (userSnap1.exists) {
                                    var user1 = userSnap1.data();
                                    /* Fetch the receiver details from users table */
                                    const userRef2 = db.collection('Users').doc(JSON.stringify(element.data().Receiver));
                                    userRef2.get().then((userSnap2) => {
                                        if (userSnap2.exists) {
                                            var user2 = userSnap2.data();
                                            /* Combine the sender and receiver details into one single object and send back to details api */
                                            var details = {
                                                UserName: null,
                                                UserNumber: null,
                                                UserBalance: null,
                                                OtherUserName: null,
                                                OtherUserNumber: null,
                                                TransactionDate: null,
                                                TransactionID: null,
                                                IsSender: false
                                            };

                                            if (element.data().IsSender) {
                                                details.UserName = user1.MobileNumber;
                                                details.UserNumber = user1.MobileNumber;
                                                details.UserBalance = user1.AccountBalance;
                                                details.OtherUserName = user2.MobileNumber;
                                                details.OtherUserNumber = user2.MobileNumber;                                                
                                            } else {
                                                details.UserName = user2.MobileNumber;
                                                details.UserNumber = user2.MobileNumber;
                                                details.UserBalance = user2.AccountBalance;
                                                details.OtherUserName = user1.MobileNumber;
                                                details.OtherUserNumber = user1.MobileNumber;
                                            }
                                            details.TransactionDate = element.data().TransactionDate;
                                            details.TransactionID = element.data().TransactionID;
                                            details.IsSender = element.data().IsSender;
                                            // db.collection('Transactions').doc('2').set({Amount: 0,IsSender: false,Receiver:9020777509,Sender:9999999999,TransactionDate:"",TransactionID:2,UserNumber:9020777509});
                                            transactionList.push(details);

                                        } else {
                                            return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                                        }
                                        return resolve({ Message: 'Details fetched successfuly', Data: transactionList, Status: 'SUCCESS' });
                                    });
                                } else {
                                    return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                                }
                            });
                        }




                    });
                }







                // if ((transactionSnap.data().IsSender && transactionRequest.MobileNumber === transactionSnap.data().Sender) ||
                //     (!transactionSnap.data().IsSender && transactionRequest.MobileNumber === transactionSnap.data().Receiver)) {
                /* Fetch the sender details from users table */
                // const userRef1 = db.collection('Users').doc(JSON.stringify(transactionSnap.data().Sender));
                // userRef1.get().then((userSnap1) => {
                //     if (userSnap1.exists) {
                //         var user1 = userSnap1.data();
                //         /* Fetch the receiver details from users table */
                //         const userRef2 = db.collection('Users').doc(JSON.stringify(transactionSnap.data().Receiver));
                //         userRef2.get().then((userSnap2) => {
                //             if (userSnap2.exists) {
                //                 var user2 = userSnap2.data();
                //                 /* Combine the sender and receiver details into one single object and send back to details api */
                //                 var details = {
                //                     UserName: null,
                //                     UserNumber: null,
                //                     UserBalance: null,
                //                     OtherUserName: null,
                //                     OtherUserNumber: null,
                //                     TransactionDate: null,
                //                     TransactionID: null
                //                 };

                //                 if (transactionSnap.data().IsSender) {
                //                     details.UserName = user1.MobileNumber;
                //                     details.UserNumber = user1.MobileNumber;
                //                     details.UserBalance = user1.AccountBalance;
                //                     details.OtherUserName = user2.MobileNumber;
                //                     details.OtherUserNumber = user2.MobileNumber;
                //                 } else {
                //                     details.UserName = user2.MobileNumber;
                //                     details.UserNumber = user2.MobileNumber;
                //                     details.UserBalance = user2.AccountBalance;
                //                     details.OtherUserName = user1.MobileNumber;
                //                     details.OtherUserNumber = user1.MobileNumber;
                //                 }
                //                 details.TransactionDate = transactionSnap.data().TransactionDate;
                //                 details.TransactionID = transactionSnap.data().TransactionID;
                //                 // db.collection('Transactions').doc('2').set({Amount: 0,IsSender: false,Receiver:9020777509,Sender:9999999999,TransactionDate:"",TransactionID:2,UserNumber:9020777509});
                //                 return resolve({ Message: 'Details fetched successfuly', Data: details, Status: 'SUCCESS' });
                //             } else {
                //                 return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                //             }

                //         });
                //     } else {
                //         return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                //     }
                // });
                // } else {
                //     return reject({ Message: 'Invalid request', Status: 'FAILURE' });
                // }

                // }
            });
            // } else {
            //     return reject({ Message: 'Invalid request', Status: 'FAILURE' });
            // }
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
