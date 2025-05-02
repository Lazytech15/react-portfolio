import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD48J3L4qUk8PUkYQ8vDWjQyI9Od-EaFU",
  authDomain: "musicstreameronline-f1691.firebaseapp.com",
  projectId: "musicstreameronline-f1691",
  storageBucket: "musicstreameronline-f1691.appspot.com",
  messagingSenderId: "959696397808",
  appId: "1:959696397808:web:5b6d4b5784d61ebcaf2935"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

export default app;