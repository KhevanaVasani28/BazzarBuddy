// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnzS4g6twOXAao5XvTzgAlENZYKiVfKU0",
  authDomain: "bazaarbuddy-628f1.firebaseapp.com",
  projectId: "bazaarbuddy-628f1",
  storageBucket: "bazaarbuddy-628f1.firebasestorage.app",
  messagingSenderId: "442023625710",
  appId: "1:442023625710:web:6458f09e3e15b4a9d5c4ff"
};

// Initialize Firebase
try{
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // Use existing app
  }

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
  
// Firestore settings
  db.settings({
    timestampsInSnapshots: true,
    merge: true
  });
  
  // Enable offline persistence
  db.enablePersistence()
    .catch((err) => {
        console.warn("Offline persistence unavailable:",err.code);
    });
 // Make available globally (for your HTML-based architecture)
  window.auth = auth;
  window.db = db;

  console.log('Firebase initialized successfully');

} catch (error) {
  console.error('Firebase initialization failed', error);
  document.body.innerHTML = `
    <div class="firebase-error">
      <h2>System Maintenance</h2>
      <p>We're experiencing technical difficulties. Please try again later.</p>
    </div>
  `;
}
