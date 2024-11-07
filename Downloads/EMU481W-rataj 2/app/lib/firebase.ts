// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv2Kr2higDUaa8Wdu_GDoa_wI_AKMshck",
  authDomain: "cosc481w-final-project.firebaseapp.com",
  projectId: "cosc481w-final-project",
  storageBucket: "cosc481w-final-project.appspot.com",
  messagingSenderId: "360107605857",
  appId: "1:360107605857:web:f3661d3dd7e349ce698f20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };