document.addEventListener('DOMContentLoaded', function() {
    const adminSection = document.getElementById('adminSection');
    const usersection = document.getElementById('usersection');
    
    const productTableBody = document.querySelector('#productTable tbody');
    const signUpButton=document.getElementById('signUpButton');
    const signInButton=document.getElementById('signInButton');
    const signInForm=document.getElementById('signIn');
    const signUpForm=document.getElementById('signup');
    const userRole = localStorage.getItem('userRole');
  displayAdminSection(userRole);
    signUpButton.addEventListener('click',function(){
        signInForm.style.display="none";
        signUpForm.style.display="block";
    })
    signInButton.addEventListener('click', function(){
        signInForm.style.display="block";
        signUpForm.style.display="none";
    })

    // if (loginForm) {
    //     loginForm.addEventListener('submit', function(event) {
    //         event.preventDefault();
    //         const username = document.getElementById('username').value;
    //         const password = document.getElementById('password').value;

    //         let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    //         const user = users.find(u => u.username === username && u.password === password);

    //         if (user) {
    //             sessionStorage.setItem('currentUser', JSON.stringify(user));
    //             window.location.href = 'dashboard.html';
    //             loadProducts();
    //         } else {
    //             alert('Invalid username or password');
    //         }
    //     });
    // }
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser.status !== 'admin') {
            if (adminSection) {
                adminSection.style.display = 'none';
            
            }
            if (usersection){
                usersection.style.display = 'none';
                hideDeleteButtons();
            }
            
        }
        if (currentUser && window.location.pathname.includes('dashboard.html')) {
            loadProducts();
        }
    }


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
    function loadProducts() {
        let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
        const productTableBody = document.querySelector('#productTable tbody');
        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            let row = productTableBody.insertRow();
            row.insertCell(0).innerText = product.productName;
            row.insertCell(1).innerText = product.productQuantity;
            row.insertCell(2).innerText = product.productPrice;
            row.insertCell(3).innerText = product.productExpiry;

            
            if (currentUser && currentUser.status === 'admin') {
                let actionsCell = row.insertCell(4);
                let deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', function() {
                    deleteProduct(index);
                });
                actionsCell.appendChild(deleteButton);
            }
        });
    }

    function deleteProduct(index) {
        let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
    function hideDeleteButtons() {
        // Assuming you want to hide delete buttons specifically in the usersection
        let deleteButtons = usersection.querySelectorAll('button');
        deleteButtons.forEach(button => {
            if (button.innerText === 'Delete') {
                button.style.display = 'none';
            }
        });
    }
});