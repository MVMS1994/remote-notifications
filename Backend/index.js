const functions = require('firebase-functions');
const app = require('./src/app.js');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const handleFunctions = (name, request, response) => {
  response.set('Access-Control-Allow-Origin', "*");
  response.set('Access-Control-Allow-Methods', "DELETE, POST, GET, OPTIONS")
  response.set('Access-Control-Allow-Headers', "Accept,Content-Type,x-uid,x-signature,Access-Control-Allow-Headers,Authorization,Origin");

  if(request.method === "OPTIONS") {
    response.status(200).send();
    return;
  }

  app[name](request.body, request.query, request.headers)
    .then((res) => { response.status(res.code).send(res.data); return; })
    .catch((err) => { response.status(500).send("Internal Server Error"); throw err; });
}

exports.sendMessage = functions.https.onRequest((request, response) => {
  handleFunctions("triggerMessage", request, response);
});

exports.registerPushToken = functions.https.onRequest((request, response) => {
  handleFunctions("savePushToken", request, response);
});