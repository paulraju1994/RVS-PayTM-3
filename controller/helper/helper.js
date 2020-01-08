var admin = require('firebase-admin')
var db = admin.firestore();

let checkDocId = (mobileNumber) => {
    return new Promise((resolve, reject) => {
        var mob = JSON.stringify(mobileNumber);
        const usersRef = db.collection('Users').doc(mob);
        usersRef.get().then((snapshot) => {
            if (snapshot.exists) {
                return resolve(true);
            } else {
                return reject(false);
            }
        });
    })
        .catch((err) => {
            return err;
        })
}
module.exports.checkDocId = checkDocId;