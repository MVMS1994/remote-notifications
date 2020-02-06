const cors      = require('cors');
const express   = require('express');
const firebase  = require('firebase-functions');

const options   = require('./src/middlewares/options');
const functions = require('./src/app.js');


const app = express();
app.use(cors({ origin: true }));
app.use(options);

const handleFunctions = (name, request, response) => {
  functions[name](request.body, request.query, request.headers)
    .then((res) => { response.status(res.code).send(res.data); return; })
    .catch((err) => { response.status(500).send("Internal Server Error"); throw err; });
}

app.post("/v0/sendMessage", (request, response) => {
  handleFunctions("triggerMessage", request, response);
});

app.post("/v0/registerPushToken", (request, response) => {
  handleFunctions("savePushToken", request, response);
});

app.delete("/v0/deletePushToken", (request, response) => {
  handleFunctions("deletePushToken", request, response);
})

exports.notifications = firebase.https.onRequest(app);