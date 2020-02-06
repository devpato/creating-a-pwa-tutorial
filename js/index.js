"use strict";

let sw = null;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(swRegistered => {
    console.log("[ServiceWorker**] - Registered");
    sw = swRegistered;
    displayNotification();
  });
}

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
