const functions = require('firebase-functions');
const app = require('./src/app.js');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendMessage = functions.https.onRequest((request, response) => {
  app.triggerMessage()
    .then((res) => { response.send(res); return; })
    .catch((err) => { response.status(500).send("Internal Server Error"); throw err; })
});
