var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();

/* API triggered on calling api/users/getallusers */
route.post('/logout', async (request, response) => {
    return new Promise(async (resolve, reject) => {
        var loggedUser = request.body;
        const userRef = db.collection('Users');
        let checkExistence = await helperObject.checkDocId(loggedUser.MobileNumber);
        if(checkExistence){
            // userRef.doc(JSON.stringify(loggedUser.MobileNumber)).get().then((snapshot) => {
            //     userRef.doc(JSON.stringify(loggedUser.MobileNumber)).update({IsActive : false});
            // })
            resolve({ Message: 'Logout successful', Status: 'SUCCESS' })
        } else {
            reject({ Message: 'Logout unsuccessful', Status: 'FAILURE' })
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