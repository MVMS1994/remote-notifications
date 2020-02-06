const R         = require("ramda");
const admin     = require("firebase-admin");
const account   = require("../secrets/remote-notifications-5931d.json");
const Constants = require("./constants");

admin.initializeApp({
  credential: admin.credential.cert(account),
  databaseURL: "https://remote-notifications-5931d.firebaseio.com"
});

const db = admin.database();

let validatePushToken = function(data) {
  if(data.uid && data.firebaseToken) {
    return true;
  }
  return false;
}

exports["triggerMessage"] = async (body, query, headers) => {
  let data = body.data || {}
  let uid  = headers["x-uid"];

  if(!uid) {
    return {
      code: 403,
      data: {
        message: "Invalid request."
      }
    }
  }

  let tokens = await db.ref("users/" + uid + "/tokens").once("value");
  let registrationTokens = [];
  if (tokens.exists()) {
    tokens.forEach(function(item) {
      if (item.val()) {
        registrationTokens.push(item.key);
      }
    });
  }

  if (registrationTokens.length == 0) {
    return {
      code: 404,
      data: {
        message: "No Tokens found for user."
      }
    }
  }

  data.actions = JSON.stringify(data.actions);
  let message = {
    data: {
      ...data,
      body: data.smallText
    },
    tokens: registrationTokens
  };

  let response = await admin.messaging().sendMulticast(message);
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
    data: {
      message: "Save Successful."
    }
  };
}
