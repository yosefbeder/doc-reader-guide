import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWKwqzDsX4wttR2yyaPctJ2uVVk0onBMU",
  authDomain: "testing-fcm-88700.firebaseapp.com",
  projectId: "testing-fcm-88700",
  storageBucket: "testing-fcm-88700.appspot.com",
  messagingSenderId: "267993844200",
  appId: "1:267993844200:web:635ddcbeefe8da79c73c5d",
  measurementId: "G-9WGR175YYQ",
};

export const app = initializeApp(firebaseConfig);
