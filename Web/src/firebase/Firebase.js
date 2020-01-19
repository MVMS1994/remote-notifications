const firebase = require('firebase/app');

require('firebase/messaging');
const config   = {
  "apiKey": "AIzaSyDVg8zRswzY1rxeFTkMBMHKKLvLRTabmfU",
  "appId": "1:95985728088:web:a0b03b3b0b718b44d8282d",
  "authDomain": "remote-notifications-5931d.firebaseapp.com",
  "databaseURL": "https://remote-notifications-5931d.firebaseio.com",
  "measurementId": "G-89TQM0N6BG",
  "messagingSenderId": "95985728088",
  "projectId": "remote-notifications-5931d",
  "storageBucket": "remote-notifications-5931d.appspot.com"
}
const PUBLIC_VAPID_KEY = "BM06tAetNIimlJBNiB0MJxjwOULZmgeZHI6DFUTjTsrzhT4DG8tq0WTX6gAnPn7o6UOXMQoMzmBiNjg0j6b5S_0"

exports["_initializeApp"] = function() { firebase.initializeApp(config); }

exports["_initMessaging"] = function() {
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(PUBLIC_VAPID_KEY);

  return messaging;
}

exports["_onTokenRefresh"] = function(onTokenRefresh) {
  return function(messaging) {
    return function() {
      messaging.onTokenRefresh(onTokenRefresh);
    }
  }
}

exports["_onMessage"] = function(onMessage) {
  return function(messaging) {
    return function() {
      messaging.onMessage(function(payload) {
        onMessage(payload)();
      });
    }
  }
}

exports["_getToken"] = function(success) {
  return function(error) {
    return function(messaging) {
      return function() {
        messaging
        .getToken()
        .then(function(token) {
          if(token) {
            success(token)();
          } else {
            error("No Instance ID token available. Request permission to generate one.")();
          }
        })
        .catch(function(err) {
          error(err)();
        });
      }
    }
  }
}

exports["_requestPermission"] = function(success) {
  return function(granted) {
    return function(denied) {
      return function() {
        Notification.requestPermission().then((permission) => {
          (permission === 'granted')? success(granted)() : success(denied)();
        });
      }
    }
  }
}