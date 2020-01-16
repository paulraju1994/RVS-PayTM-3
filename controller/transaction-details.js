var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');
/* API triggered on calling api/user/add-money */
route.post('/transaction-details', async (request, response) => {
    return new Promise(async (resolve, reject) => { 
        let transactionRequest = request.body;
        if(transactionRequest.TransactionID && transactionRequest.Sender !== transactionRequest.Receiver){
            const transactionRef = db.collection('Transactions').doc(JSON.stringify(transactionRequest.TransactionID));
            
        } else {
            return reject({ Message: 'Invalid transaction', Status: 'FAILURE' });
        }
    });
});
