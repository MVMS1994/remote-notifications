importScripts('/__/firebase/7.8.0/firebase-app.js');
importScripts('/__/firebase/7.8.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

var registerOnClick = function() {
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    var promise = clients.matchAll({
      includeUncontrolled: true
    }).then((list) => {
      if (list && list.length > 0) {
        console.log(event.notification.data);

        return list[0].focus();
      } else {
        console.clear();
        console.log(event.notification.data);

        return clients.openWindow("/");
      }
    });

    event.waitUntil(promise);
  }, false);
}

const messaging = firebase.messaging();

registerOnClick();
messaging.setBackgroundMessageHandler((payload) => {
  payload.data.priority = payload.priority || "normal";
  var options = {
    body: payload.data.body,
    data: payload.data
  }
  return self.registration.showNotification(payload.data.title, options);
});