var admin = require('firebase-admin')
var db = admin.firestore();

let checkUserSession = (mobileNumber) => {
    return new Promise((resolve, reject) => {
        var mob = JSON.stringify(mobileNumber);
        const usersRef = db.collection('Users').doc(mob);
        usersRef.get().then((snapshot) => {
            if(snapshot.data().IsActive){
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

let checkUserCredentials = (mobileNumber , password) => {
    return new Promise((resolve, reject) => {
        var mob = JSON.stringify(mobileNumber);
        const usersRef = db.collection('Users').doc(mob);
        usersRef.get().then((snapshot) => {
            if (snapshot.data().MobileNumber === mobileNumber && snapshot.data().Password === password) {
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

let checkTransactionId = (transactionID) => {
    return new Promise((resolve, reject) => {
        var transID = JSON.stringify(transactionID);
        const transactionRef = db.collection('Transactions').doc(transID);
        transactionRef.get().then((snapshot) => {
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

let fetchUserDetails = (mobileNumber) => {
    return new Promise((resolve, reject) => {
        var mob = JSON.stringify(mobileNumber);
        const userRef = db.collection('Users').doc(mob);
        userRef.get().then((snapshot) => {
            if (snapshot.exists) {
                return resolve(snapshot.data().MobileNumber);
            } else {
                return reject(null);
            }
        });
    })
        .catch((err) => {
            return err;
        })
}

module.exports.checkUserSession = checkUserSession;
module.exports.checkDocId = checkDocId;
module.exports.checkUserCredentials = checkUserCredentials;
module.exports.checkTransactionId = checkTransactionId;
module.exports.fetchUserDetails = fetchUserDetails;