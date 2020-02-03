var auth = firebase.auth();
var ui = new firebaseui.auth.AuthUI(firebase.auth());

exports["_initSignIn"] = function() {
  var config = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) { return false; },
      signInFailure: function(error) { console.error(error); },
      uiShown: function() {}
    },
    autoUpgradeAnonymousUsers: true,
    signInFlow: 'popup',
    signInOptions: [{
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }]
  };

  ui.start('#firebaseui-auth-container', config);
}

exports["_initAuthListener"] = function(successCallback) {
  return function(errorCallback) {
    return function() {
      var getUser = function(user) {
        if(user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var uid = user.uid;
          var phoneNumber = user.phoneNumber;
          var providerData = user.providerData;
          user.getIdToken().then(function(accessToken) {
            successCallback({
              uid: uid,
              email: email,
              photoURL: photoURL,
              accessToken: accessToken,
              displayName: displayName,
              phoneNumber: phoneNumber,
              providerData: providerData,
              emailVerified: emailVerified
            })();
          });
        } else {
          successCallback(null)();
        }
      }

      var collectError = function(err) {
        errorCallback(err.toString())();
      }
      
      auth.onAuthStateChanged(getUser, collectError);
    }
  }
}

exports["_signOut"] = function() {
  auth.signOut();
}