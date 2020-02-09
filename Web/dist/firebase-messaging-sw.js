importScripts('./localforage.min.js');
importScripts('/__/firebase/7.8.0/firebase-app.js');
importScripts('/__/firebase/7.8.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

var registerOnClick = function() {
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // var promise = clients.matchAll({
    //   includeUncontrolled: true,
    //   type: 'window'
    // }).then((list) => {
    //   if (list && list.length > 0) {
    //     return list[0].focus();
    //   } else {
    //     return clients.openWindow("/");
    //   }
    // });

    event.waitUntil(clients.openWindow("/"));
  }, false);
}

var saveNotifications = async function(conn, newMsg) {
  let msgs = (await conn.getItem("__saved_notif")) || [];
  msgs.push(newMsg.data);
  await conn.setItem("__saved_notif", msgs);
}

const messaging = firebase.messaging();

registerOnClick();
messaging.setBackgroundMessageHandler(async (payload) => {
  let conn = localforage.createInstance({
    name: "__rn_db",
    driver: localforage.INDEXEDDB
  });
  user = await conn.getItem("__auth_token");
  if(user != null) {
    payload.data.priority = payload.priority || "normal";
    var options = {
      body: payload.data.body,
      data: payload.data
    }
    await saveNotifications(conn, payload);
    self.registration.showNotification(payload.data.title, options);
  } else {
    console.log("no users found");
  }
});