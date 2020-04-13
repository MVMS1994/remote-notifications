const PUBLIC_VAPID_KEY = "BM06tAetNIimlJBNiB0MJxjwOULZmgeZHI6DFUTjTsrzhT4DG8tq0WTX6gAnPn7o6UOXMQoMzmBiNjg0j6b5S_0"

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
        payload.data.priority = payload.priority || "normal";
        onMessage(payload.data)();
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
        setTimeout(function() {
          Notification.requestPermission().then((permission) => {
            (permission === 'granted')? success(granted)() : success(denied)();
          });
        }, 1000);
      }
    }
  }
}