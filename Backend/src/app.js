const R         = require("ramda");
const admin     = require("firebase-admin");
const account   = require("../secrets/remote-notifications-5931d.json");
const Constants = require("./constants");

admin.initializeApp({
  credential: admin.credential.cert(account),
  databaseURL: "https://remote-notifications-5931d.firebaseio.com"
});

const db = admin.database();

var validatePushToken = function(data) {
  if(data.uid && data.firebaseToken) {
    return true;
  }
  return false;
}

exports["triggerMessage"] = async (body, query, headers) => {
  const LOCALHOST = "fYmUIERQbiFqP9E2Dkx-Xk:APA91bHcbwic4dtrwGPTNR81w9w4gF5rUZO9HX8PyjgqyjhQYte9vGHXiOV9cB5DU5UkDArkhV4LTti8dF7kE7JwsuSHFt3zl5rcZAW9tYmUmR5MmzOxxOXa1lA-rQlLQhIOruNLTMcH";
  const REMOTE = "fZ_dilLVgo04gg27CRXsmU:APA91bFeY1rY8ze2rZLLenmjbWeek017U4Odt5-jM-sJVUHBl90ZsyIzgjK8RTj5YHp2ZE545f0Fupcwpqo_p1dMY5kKEeuopDsL71oUMnksnabUC09J1yjeVUi3Xin-Sk4wxTITytzx";

  var data = body.data || {}
  var uid  = headers["x-uid"];

  if(!uid) {
    return {
      code: 403,
      data: {
        message: "Invalid request."
      }
    }
  }

  var registrationTokens = [ LOCALHOST, REMOTE ];
  var message = {
    data: {
      source: data.source,
      title: data.title,
      body: data.smallText,
      bigText: data.bigText,
      actions: JSON.stringify(data.actions)
    },
    tokens: registrationTokens
  };

  var response = await admin.messaging().sendMulticast(message);
  return {
    code: 200,
    data: response
  };
}

exports["savePushToken"] = async (data, query, headers) => {
  if(!validatePushToken(data)) {
    return {
      code: 403,
      data: {
        message: "Invalid request."
      }
    };
  }

  let tokenRef = db.ref("tokens/" + data.firebaseToken);
  let userRef  = db.ref("users/" + data.uid + "/tokens");
  let tokenSnapshot = await tokenRef.once("value");
  let userSnapshot  = await userRef.once("value");
  let sameUser = false;

  if(tokenSnapshot.exists()) {
    let currentUid = tokenSnapshot.child("uid");
    if(currentUid.exists()) {
      let currentRef  = db.ref("users/" + currentUid.val() + "/tokens/" + data.firebaseToken);
      let currentUser = await currentRef.once("value");

      if(currentUser.exists() && currentUid.val() !== data.uid) {
        await currentRef.remove();
      } else if(currentUser.exists()) {
        sameUser = (currentUid.val() === data.uid)
      }
    }
  }

  if(!sameUser) {
    let existingTokenUidMap = tokenSnapshot.exists()? tokenSnapshot.val() : Constants.DEFAULT_TOKEN_USER_DB;
    let existingTokens = userSnapshot.exists()? userSnapshot.val() : Constants.DEFAULT_USER_DB.tokens;

    existingTokenUidMap.uid = data.uid;
    existingTokens[data.firebaseToken] = true;

    await tokenRef.set(existingTokenUidMap);
    await userRef.set(existingTokens);
  }

  return {
    code: 200,
    data: "ok"
  };
}
