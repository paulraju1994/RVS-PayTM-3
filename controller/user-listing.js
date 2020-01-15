var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();

/* API triggered on calling api/users/getallusers */
route.get('/getallusers', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        const userRef = db.collection('Users');
        userRef.get().then((snapshot) => {
            if(snapshot && snapshot.docs) {
                var usersList = [];
                snapshot.docs.forEach((element) => {
                    usersList.push(element.data());
                });
                return resolve({ Message: 'User list fetching successful', Data: usersList , Status: 'SUCCESS' });
            } else {
                return reject({ Message: 'No data found', Status: 'FAILURE' });
            }
        }); 
    })
    .then(result => {
        response.send(result);
    })
    .catch(err => {
        response.send(err);
    });
});
module.exports = route;