var fs = require('fs');
var helper = require('../helper/helper');
var admin = require('firebase-admin');
var db = admin.firestore();
var jsonObject = [];
var i_json = 0;
module.exports = async (req, res, next) => {
    let reqBody = req.body;
    let url = JSON.stringify(req.url);

    if (url.includes('users')) {
        next();
    }
    if (reqBody) {
        let userData;
        // if(reqBody.IsAdmin) {

        // } else {
        if (url.includes('register')) {
            next();
        }
        var mobileNumber = JSON.stringify(reqBody.MobileNumber);

        /* Fn for activating the user */
        function userActivate() {
            let mobNum = helper.checkDocId(mobileNumber);
            if (mobNum) {
                db.collection('Users').doc(mobileNumber).update({ IsActive: true });
            } else {
                next();
            }
        }

        /* Fn for inactivating the user */
        function userInActivate() {
            let mobNum = helper.checkDocId(mobileNumber);
            if (mobNum) {
                db.collection('Users').doc(mobileNumber).update({ IsActive: false });
            } else {
                next();
            }
        }

        /* Fn for checking the active flag of user */
        var activeFlag = await function (mobileNumber) {
            return new Promise(async (resolve, reject) => {
                // let mobNum = Number(mobileNumber);
                let userExists = await helper.checkDocId(mobileNumber);
                if (userExists) {
                    db.collection('Users').doc(JSON.stringify(mobileNumber)).get().then((snapshot) => {
                        resolve(true);
                    })
                } else {
                    reject(false);
                }
            })
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    return err;
                })
        }

        if (url.includes('login')) {
            function createJSON() {
                var sessionID = (Math.random() * 100000);
                sid = sessionID;
                var mob = reqBody.MobileNumber;
                var loginTime = new Date().toLocaleString();
                var logoutTime = '';
                item = {}
                item["sessionID"] = sessionID;
                item["MobileNumber"] = mob;
                item["loginTime"] = loginTime;
                item["logoutTime"] = logoutTime;
                jsonObject[i_json++] = item;
            }
            let userMob = req.body.MobileNumber;
            let userMobStr = JSON.stringify(req.body.MobileNumber);
            let userPswd = req.body.Password;

            // var r;
            var activeUser = await activeFlag(userMob);

//test
            // res.send({ Message: activeUser, Status: 'FAILURE' });


            if (activeUser === true) {
                db.collection('Users').doc(userMobStr).get().then((snapshot) => {
                    if (snapshot.data().MobileNumber == userMob && snapshot.data().Password == userPswd) {
                        var userActive = snapshot.data().IsActive;
                        if (userActive == false) {
                            createJSON();
                            userData = jsonObject;
                            fs.writeFileSync('user.json', JSON.stringify(userData));
                            userActivate();
                            next();
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }

                });

                // if (res.statusCode == 401) {
                //     uinactivesql();
                //     next();
                // }
            } else {
                next();
            }
        } else if (url.includes('logout')) {

            let userMob = req.body.MobileNumber;
            let userMobStr = JSON.stringify(req.body.MobileNumber);
            let userPswd = req.body.Password;

            var activeUser = await activeFlag(userMob);

            //test
            // res.send({ Message: activeUser, Status: 'FAILURE' });


            if (!activeUser) {
                res.send({ Message: 'Already logged out', Status: 'FAILURE' });
                // next();
            } else {
                db.collection('Users').doc(userMobStr).get().then((snapshot) => {
                    if (snapshot.data().MobileNumber == userMob && snapshot.data().Password == userPswd) {
                        
                        var activeUser = snapshot.data().IsActive;
                        if (activeUser) {                            
                            userInActivate();
                            let sampleData;
                            for (i = 0; i < jsonObject.length; i++) {
                                if (userMob == jsonObject[i].MobileNumber) {
                                    jsonObject[i].logoutTime = new Date().toLocaleString();
                                }
                            }
                            sampleData = jsonObject;
                            fs.writeFileSync('user.json', JSON.stringify(sampleData));
                            res.send({ Message: 'Logout successful', Status: 'SUCCESS' });
                            // next();
                        } else {
                            res.send({ Message: 'Already logged out.', Status: 'FAILURE' });
                        }
                    } else {
                        res.send({ Message: 'Logout Unsuccessful', Status: 'FAILURE' });
                    }

                });
            }
        }


        // }
    }
}