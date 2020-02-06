const R             = require("ramda");
const admin         = require("firebase-admin");
const account       = require("../secrets/remote-notifications-5931d.json");
const notifications = require("./notifications/v0/index.js");

admin.initializeApp({
  credential: admin.credential.cert(account),
  databaseURL: "https://remote-notifications-5931d.firebaseio.com"
});
const db = admin.database();



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

  let message = await notifications.sendNotifications(db, uid, data);
  if (message.tokens.length === 0) {
    return {
      code: 404,
      data: {
        message: "No Tokens found for user."
      }
    }
  }

  let response = await admin.messaging().sendMulticast(message);
  return {
    code: 200,
    data: response
  };
}


exports["savePushToken"] = async (body, query, headers) => {
  if (!(body.uid && body.firebaseToken)) {
    return {
      code: 403,
      data: {
        message: "Invalid request."
      }
    };
  }

  await notifications.saveTokenToDB(body, db);
  return {
    code: 200,
    data: {
      message: "Save Successful."
    }
  };
}


exports["deletePushToken"] = async(body, query, headers) => {
  if(!query.firebaseToken) {
    return {
      code: 403,
      data: {
        message: "Invalid request."
      }
    }
  }

  await notifications.deleteTokenFromDB(query, db);
  return {
    code: 200,
    data: {
      message: "Deleted."
    }
  };
}