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
firebase.initializeApp(firebaseConfig);

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
      if (err.code === 'failed-precondition') {
        console.warn("Offline persistence can only be enabled in one tab at a time.");
      } else if (err.code === 'unimplemented') {
        console.warn("The current browser does not support offline persistence.");
      }
    });
  // Export services
  export { auth, db };
  
} catch (err) {
  console.error("Firebase initialization failed", err);
}
