const Constants = require("../../constants");

exports["sendNotifications"] = async (db, uid, data) => {  
  let tokens = await db.ref("users/" + uid + "/tokens").once("value");
  let registrationTokens = [];
  
  if (tokens.exists()) {
    tokens.forEach((item) => { if (item.val()) { registrationTokens.push(item.key); } });
  }

  data.actions = JSON.stringify(data.actions);
  return {
    data: {
      ...data,
      body: data.smallText
    },
    tokens: registrationTokens
  };
}


exports["saveTokenToDB"] = async (data, db) => {
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
}


exports["deleteTokenFromDB"] = async (data, db) => {
  let tokenRef = db.ref("tokens/" + data.firebaseToken + "/uid");
  let tokenSnapshot = await tokenRef.once("value");

  if(tokenSnapshot.exists()) {
    let currentRef  = db.ref("users/" + tokenSnapshot.val() + "/tokens/" + data.firebaseToken);
    let currentUser = await currentRef.once("value");

    if(currentUser.exists()) {
      await currentRef.remove();
    }
    tokenRef.remove();
  }
}