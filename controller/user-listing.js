var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var helperObject = require('./helper/helper');

/* API triggered on calling api/user/login */
route.get('/getallusers', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        const userRef = db.collection('Users');
        userRef.get().then((snapshot) => {
            console.log(snapshot);
            if(snapshot) {
                return resolve({ MESSAGE: 'User list fetching successful', DATA: snapshot.docs() , STATUS: 'SUCCESS' });
            } else {
                reject({ Message: 'No data found', Status: 'FAILURE' });
            }
        }); 
        // return resolve({ MESSAGE: 'User list fetching successful', DATA: snapshot , STATUS: 'SUCCESS' });
        // return reject({ Message: 'No data found', Status: 'FAILURE' });
    })
    .then(result => {
        response.send(result);
    })
    .catch(err => {
        response.send(err);
    });
});
module.exports = route;