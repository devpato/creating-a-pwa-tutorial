"use strict";

let sw = null;
const tokenString = document.getElementById("token");

const config = {
  apiKey: "AIzaSyDx6N_Ju0rkWWpxvVST9foNJ3Pt-ab_Tu0",
  authDomain: "pwa-push-fcm.firebaseapp.com",
  databaseURL: "https://pwa-push-fcm.firebaseio.com",
  projectId: "pwa-push-fcm",
  storageBucket: "pwa-push-fcm.appspot.com",
  messagingSenderId: "452585455460",
  appId: "1:452585455460:web:57446702ddc55629738471"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(swRegistered => {
    console.log("[ServiceWorker**] - Registered");
    sw = swRegistered;
    displayNotification();
  });
}

messaging
  .requestPermission()
  .then(() => {
    return messaging.getToken();
  })
  .then(token => {
    tokenString.innerHTML = "Token Is : " + token;
    subscribeTokenToTopic(token, "hey");
  })
  .catch(err => {
    console.log("Unable to get permission to notify", err);
  });

messaging.onMessage(payload => {
  console.log("Message received. ", payload);
  const { title, ...options } = payload.notification;
});

function toggleMenu() {
  const navbar = document.getElementById("navbar");
  if (navbar.className === "navbar") {
    navbar.className += " responsive";
  } else {
    navbar.className = "navbar";
  }
}

function notification() {
  const options = {
    body: "Testing Our Notification",
    icon: "/icons/icon.png"
  };

  sw.showNotification("Hi there!!", options);
}

function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function subscribeTokenToTopic(token, topic) {
  console.log(token);
  fetch("https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic, {
    method: "POST",
    headers: new Headers({
      Authorization: "key=YOUR-API-SERVER-KEY-HERE"
    })
  })
    .then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw "Error subscribing to  the following topic: " +
          response.status +
          " - " +
          response.text();
      } else {
        console.log('Successfully subscribed to "' + topic + '"');
      }
    })
    .catch(error => {
      console.error(error);
    });
}
