import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQEu9oi2z_QCFeRmOKE8UEzYe2D37G1fY",
  authDomain: "react-chat-app-8803c.firebaseapp.com",
  databaseURL: "https://react-chat-app-8803c-default-rtdb.firebaseio.com",
  projectId: "react-chat-app-8803c",
  storageBucket: "react-chat-app-8803c.appspot.com",
  messagingSenderId: "561080515853",
  appId: "1:561080515853:web:15e54f2ee8762b77444444",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
