// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDYddaf7TpTZ2BmAKczOWVWnAj3I2Rpu6c",
  authDomain: "data-test-33dd4.firebaseapp.com",
  projectId: "data-test-33dd4",
  storageBucket: "data-test-33dd4.appspot.com",
  messagingSenderId: "657221619076",
  appId: "1:657221619076:web:a527809cb31b586757e1d1",
  measurementId: "G-JJ0L1HY6QQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Check if elements are present
const signUp = document.getElementById('submitSignUp');
const signIn = document.getElementById('submitSignIn');

if (!signUp || !signIn) {
  console.error('Sign-up or sign-in button not found!');
}

function showMessage(message, divId){
  var messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    }, 5000);
  } else {
    console.error(`Message div ${divId} not found`);
  }
}

if (signUp) {
  signUp.addEventListener('click', (event) => {
    console.log('Sign up button clicked!');
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('status').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          username: username,
          password: password,
          status: status
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            window.location.href = 'login.html';
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
          showMessage('Unable to create User', 'signUpMessage');
        }
      });
  });
}


document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.getElementById('submitSignIn');
    signInButton.addEventListener('click', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful', 'signInMessage');
                const user = userCredential.user;
                localStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error(`Login failed: ${errorCode}`, 'signInMessage');
                console.error(error.message);
            });
    });
});