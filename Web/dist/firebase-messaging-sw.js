self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
      console.log(clientList);
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});


importScripts('./localforage.min.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyDVg8zRswzY1rxeFTkMBMHKKLvLRTabmfU",
  authDomain: "remote-notifications-5931d.firebaseapp.com",
  databaseURL: "https://remote-notifications-5931d.firebaseio.com",
  projectId: "remote-notifications-5931d",
  storageBucket: "remote-notifications-5931d.appspot.com",
  messagingSenderId: "95985728088",
  appId: "1:95985728088:web:a0b03b3b0b718b44d8282d",
  measurementId: "G-89TQM0N6BG"
};

firebase.initializeApp(firebaseConfig);
var saveNotifications = async function(conn, newMsg) {
  let msgs = (await conn.getItem("__saved_notif")) || [];
  msgs.push(newMsg.data);
  await conn.setItem("__saved_notif", msgs);
}

const messaging = firebase.messaging();
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
      data: payload.data,
      icon: './logo.png'
    }
    await saveNotifications(conn, payload);
    self.registration.showNotification(payload.data.title, options);
  } else {
    console.log("no users found");
  }
});