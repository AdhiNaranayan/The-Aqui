var admin = require("firebase-admin");
var CustomerAccount = require("./aquilahundi-950213791192.json");

var _customerNotify = admin.initializeApp({
       credential: admin.credential.cert(CustomerAccount),
       databaseURL: "https://hundi-android.firebaseio.com"
       }, 'customerNotify');

exports.CustomerNotify = _customerNotify;
