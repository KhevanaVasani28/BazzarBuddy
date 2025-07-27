// Replace the entire content with:
const firebaseConfig = {
  apiKey: "AIzaSyBnzS4g6twOXAao5XvTzgAlENZYKiVfKU0",
  authDomain: "bazaarbuddy-628f1.firebaseapp.com",
  projectId: "bazaarbuddy-628f1",
  storageBucket: "bazaarbuddy-628f1.appspot.com",
  messagingSenderId: "442023625710",
  appId: "1:442023625710:web:6458f09e3e15b4a9d5c4ff"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Make available globally
window.auth = auth;
window.db = db;

console.log('Firebase initialized successfully');
