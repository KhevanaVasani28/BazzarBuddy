document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const getLocationBtn = document.getElementById('get-location');
    const locationStatus = document.getElementById('location-status');
    
    // Initialize with register form hidden
   
    // Initialize Firebase
    const auth = firebase.auth();
    const db = firebase.firestore();
    // Location variable
    let userLocation = null;

    // Toggle between forms
     showRegister.addEventListener('click', function(e) {
        console.log("Show register clicked");
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Login function
    loginBtn.addEventListener('click', async function() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            // Show loading state
            document.getElementById('login-text').classList.add('hidden');
            document.getElementById('login-spinner').classList.remove('hidden');
            loginBtn.disabled = true;
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'supplier.html';
        } catch (error) {
            console.error('Login error:', error);
            alert(getErrorMessage(error.code));
        } finally {
            document.getElementById('login-text').classList.remove('hidden');
            document.getElementById('login-spinner').classList.add('hidden');
            loginBtn.disabled = false;
        }
    });

    // Location handler
    getLocationBtn.addEventListener('click', function() {
        if (!navigator.geolocation) {
            locationStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Geolocation not supported';
            return;
        }

        getLocationBtn.disabled = true;
        locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting location...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                locationStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    Location captured: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}
                `;
                getLocationBtn.disabled = false;
            },
            (error) => {
                console.error('Location error:', error);
                locationStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i> 
                    Location error: ${error.message}
                `;
                getLocationBtn.disabled = false;
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });

    // Registration function
    registerBtn.addEventListener('click', async function() {
        const shopName = document.getElementById('reg-shop-name').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        
        // Validation
        if (!shopName || !phone || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        if (!userLocation) {
            alert('Please capture your location first');
            return;
        }

        try {
            // Show loading state
            document.getElementById('register-text').classList.add('hidden');
            document.getElementById('register-spinner').classList.remove('hidden');
            registerBtn.disabled = true;
            
            // 1. Create authentication account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // 2. Save additional data to Firestore
            await db.collection('suppliers').doc(user.uid).set({
                id: user.uid,
                shopName:shopName,
                contactNumber: phone,
                email: email,
                location: userLocation,
                status: 'CLOSED',
                stock: {'Onions': false,
                          'Tomatoes': false,
                          'Potatoes': false,
                          'Oil': false,
                          'Wheat Flour': false,
                          'Rice': false,
                        'Milk': false, 'Cheese' :false, 'Butter':false, 'Eggs':false,
                          'Chicken':false,
                        'Spices': false, 'Lentils':false,
                          'Vegetables':false, 'Fruits': false
                },
                rating: { up: 0, down: 0 },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // 3. Redirect to dashboard
            window.location.href = 'supplier.html';
            
        } catch (error) {
            console.error('Registration error:', error);
            alert(getErrorMessage(error.code));
        } finally {
            document.getElementById('register-text').classList.remove('hidden');
            document.getElementById('register-spinner').classList.add('hidden');
            registerBtn.disabled = false;
        }
    });

    // Error message helper
    function getErrorMessage(code) {
        const messages = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Please enter a valid email address',
            'auth/weak-password': 'Password must be at least 6 characters',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled',
            'permission-denied': 'Database write failed - check Firestore rules',
            'default': 'Operation failed. Please try again'
        };
        return messages[code] || messages['default'];
    }
});

