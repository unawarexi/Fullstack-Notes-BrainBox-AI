// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth} from "firebase/auth"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEXWErrTNsMKe5_gn8W3OIdrrh1BAY29E",
  authDomain: "notes-brainbox-ai.firebaseapp.com",
  projectId: "notes-brainbox-ai",
  storageBucket: "notes-brainbox-ai.firebasestorage.app",
  messagingSenderId: "201152227204",
  appId: "1:201152227204:web:64ffbb86068dba227e5fd1",
  measurementId: "G-TLWG1HE3YG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
// const analytics = getAnalytics(app);
