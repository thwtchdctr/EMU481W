//TO-DO: On browser/app exit, logout


"use client" //Client component

//Import statements
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logoutHook } from "./lib/logoutHook";

export default function Home() {

  //Variable for user state, represents if user is logged in or not. Either a User or null, initialized to null
  const [user, setUser] = useState<User | null>(null);

  const[userFullName, setUserFullName] = useState<string | null>(null);

  const logout = logoutHook();


  const fetchUserFullName = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid); // Reference to the user's document in Firestore
      const docSnap = await getDoc(docRef); // Fetch the document
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserFullName(data?.name || null); // Set the user's name if found
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  //Unsure what useEffect does, Stack Overflow told me to
  useEffect(() => {
    console.log('Current user:', auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged fired, user is: ', user); //Console debug statement
      if(user){
        setUser(user);
        fetchUserFullName(user.uid);
      } else{
        setUser(null);
        setUserFullName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  //UI
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2 style={{ marginTop: '60px' }}>Welcome to the Financial Literacy Website</h2>

      {/* Conditionally render login state */}
      <div style={{ marginTop: '20px' }}>
        {user ? (
          <p>You are logged in as: {userFullName}</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
      <div className="text-right">
            <button className="button" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
