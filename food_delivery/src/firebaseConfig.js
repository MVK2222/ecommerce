import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import getStorage for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyABrBYFkEPvxBsKO3cyoiK4aTOAlsS25gE",
  authDomain: "food-delivery-bae56.firebaseapp.com",
  projectId: "food-delivery-bae56",
  storageBucket: "food-delivery-bae56.appspot.com",
  messagingSenderId: "160368556128",
  appId: "1:160368556128:web:700b1b5b3cd5de0adb2b05",
  //measurementId: "G-Q1FPXS915Y",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Authentication
const storage = getStorage(app); // Initialize Storage

export { db, auth, storage };