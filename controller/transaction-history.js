var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
var transactionList = [];
var i = 0;
var count = 0;
/* API triggered on calling api/user/transaction-history */
route.post('/transaction-history', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        let transactionRequest = request.body;
        transactionRequest.MobileNumber = JSON.parse(transactionRequest.MobileNumber);
        if (transactionRequest.MobileNumber) {
            const transactionRef = db.collection('Transactions');
            await transactionRef.get().then((transactionSnap) => {
                transactionSnap.docs.forEach(element => {
                    if ((element.data().IsSender && transactionRequest.MobileNumber === element.data().Sender) ||
                        (!element.data().IsSender && transactionRequest.MobileNumber === element.data().Receiver)) {
                            count++;
                             resolve({ Message: 'Details fetched successfuly', Data: count, Status: 'SUCCESS' });
                        /* Fetch the details of the user */
                        const userRef1 = db.collection('Users').doc(JSON.stringify(transactionRequest.MobileNumber));
                        userRef1.get().then((userSnap1) => {
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
                                details.UserName = userSnap1.data().MobileNumber;
                                details.UserNumber = userSnap1.data().MobileNumber;
                                details.UserBalance = userSnap1.data().AccountBalance;
                                details.OtherUserName = element.data().Receiver;
                                details.OtherUserNumber = element.data().Receiver;
                            } else {
                                details.UserName = element.data().Sender;
                                details.UserNumber = element.data().Sender;
                                details.UserBalance = userSnap1.data().AccountBalance;
                                details.OtherUserName = userSnap1.data().MobileNumber;
                                details.OtherUserNumber = userSnap1.data().MobileNumber;
                            }
                            details.TransactionDate = element.data().TransactionDate;
                            details.TransactionID = element.data().TransactionID;
                            details.IsSender = element.data().IsSender;
                            transactionList[i++] = details;
                        });


                    }
                })
            })
            if(transactionList.length === count){
                resolve(transactionList);
            }
            
            // await transactionRef.get().then(async (transactionSnap) => {
            //     if (transactionSnap && transactionSnap.docs) {

            //         /* Fetch all the items in transaction table */
            //         transactionSnap.docs.forEach((element) => {
            //             /* Check in each item whether the requested phone number is involved */
            //             if ((transactionRequest.MobileNumber === element.data().Sender) ||
            //                 (transactionRequest.MobileNumber === element.data().Receiver)) {

            //                 /* Fetch the details of the user */
            //                 const userRef1 = db.collection('Users').doc(JSON.stringify(transactionRequest.MobileNumber));
            //                 userRef1.get().then((userSnap1) => {
            //                     if (userSnap1.exists) {
            //                         var user1 = userSnap1.data();
            //                         var details = {
            //                             UserName: null,
            //                             UserNumber: null,
            //                             UserBalance: null,
            //                             OtherUserName: null,
            //                             OtherUserNumber: null,
            //                             TransactionDate: null,
            //                             TransactionID: null,
            //                             IsSender: false
            //                         };

            //                         if (element.data().IsSender) {
            //                             details.UserName = user1.MobileNumber;
            //                             details.UserNumber = user1.MobileNumber;
            //                             details.UserBalance = user1.AccountBalance;
            //                             details.OtherUserName = element.data().Receiver;
            //                             details.OtherUserNumber = element.data().Receiver;
            //                         } else {
            //                             details.UserName = element.data().Sender;
            //                             details.UserNumber = element.data().Sender;
            //                             details.UserBalance = user1.AccountBalance;
            //                             details.OtherUserName = user1.MobileNumber;
            //                             details.OtherUserNumber = user1.MobileNumber;
            //                         }
            //                         details.TransactionDate = element.data().TransactionDate;
            //                         details.TransactionID = element.data().TransactionID;
            //                         details.IsSender = element.data().IsSender;

            //                         transactionList.push(details);

            //                         // if (transactionSnap.docs.length === transactionList.length) {
            //                         //     return resolve({ Message: 'Details fetched successfuly', Data: transactionList, Status: 'SUCCESS' });
            //                         // }
            //                     } else {
            //                         return reject({ Message: 'Invalid requestaaa', Status: 'FAILURE' });
            //                     }
            //                 });
            //             } 
            //             // else {
            //             //     return reject({ Message: 'Invalid requestbbb', Status: 'FAILURE' });
            //             // }
            //         });
            //     }
            // });
            // return resolve({ Message: 'Details fetched successfuly', Data: transactionList, Status: 'SUCCESS' });
        } else {
            return reject({ Message: 'Invalid request', Status: 'FAILURE' });
        }
    })
        .then(result => {
            // if (transactionList == '') {
                response.send({ Message: 'No Transactions yet', Data: result, Status: 'SUCCESS' });
            // }
            // else {
            //     response.send({ Message: 'Details fetched successfuly', Data: result, Status: 'SUCCESS' });
            //     transactionList = [];
            // }
        })
        .catch(err => {
            response.send({ Message: 'No Transactions yet', Data: result, Status: 'SUCCESS' });
        });
});


module.exports = route;
