const admin   = require("firebase-admin");
const account = require("../secrets/remote-notifications-5931d.json");

admin.initializeApp({
  credential: admin.credential.cert(account),
  databaseURL: "https://remote-notifications-5931d.firebaseio.com"
});

exports["triggerMessage"] = async () => {
  const LOCALHOST = "dP4xWfUSv9nEN46zTI9EkD:APA91bEQ65WEkfw3tkK4Y9Y7JCaenCacp1hN4FhKnHvJscP91oAtxiFyYJFASbIEHsFVw2Z6DUjD8KpIGpi0bmCrHvub0Q-JutX7gm4mHGgvMzkJZ2xAab3hFT06lpIV5o5BiSnqbAJG"
  const REMOTE = "fZ_dilLVgo04gg27CRXsmU:APA91bFeY1rY8ze2rZLLenmjbWeek017U4Odt5-jM-sJVUHBl90ZsyIzgjK8RTj5YHp2ZE545f0Fupcwpqo_p1dMY5kKEeuopDsL71oUMnksnabUC09J1yjeVUi3Xin-Sk4wxTITytzx"

  var registrationTokens = [ LOCALHOST, REMOTE ];
  var message = {
    data: {
      title: 'Message Sender',
      body: 'Message Body'
    },
    tokens: registrationTokens
  };

  var response = await admin.messaging().sendMulticast(message);
  console.log(response);

  return response;
}

