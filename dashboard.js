import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

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

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          localStorage.setItem('userRole', userData.status); // Assuming 'status' holds the role
          console.log(userData.status)
        } else {
          console.log("No document found matching id");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    } else {
      console.log("User not logged in");
      // Redirect to login or handle user not logged in
    }
  });
  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })
  function displayAdminSection(role) {
    const adminSection = document.getElementById('adminSection');
    const usersection = document.getElementById('usersection'); // Ensure this is the correct ID
  
    if (role === 'admin') {
      if (adminSection) adminSection.style.display = 'block';
      if (usersection) usersection.style.display = 'block';
    } else {
      if (adminSection) adminSection.style.display = 'none';
      if (usersection) usersection.style.display = 'none';
      hideDeleteButtons();
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    const addProductForm = document.getElementById('addProductForm');

    if (addProductForm) {
        addProductForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevent the form from submitting the traditional way

            // Get the values from the form fields
            const productName = document.getElementById('productName').value;
            const productQuantity = parseInt(document.getElementById('productQuantity').value, 10);
            const productPrice = parseFloat(document.getElementById('productPrice').value);
            const productExpiry = document.getElementById('productExpiry').value;

            // Create a product object to send to Firestore
            const productData = {
                productName,
                productQuantity,
                productPrice,
                productExpiry,
                createdAt: new Date()  // Optional: add creation date
            };

            // Reference to your Firestore collection
            const db = getFirestore();
            const productCollectionRef = doc(collection(db, "products"));

            // Adding the product to Firestore
            setDoc(productCollectionRef, productData)
                .then(() => {
                    console.log("Product added successfully!");
                    alert('Product added successfully');
                    addProductForm.reset();  // Reset form after submission
                    // Optionally, you can reload or update your product list
                })
                .catch((error) => {
                    console.error("Error adding product: ", error);
                    alert('Failed to add product');
                });
        });
    }
});