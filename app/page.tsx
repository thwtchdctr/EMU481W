"use client"

import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('Current user:', auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged fired, user is: ', user);
      if(user){
        setUser(user);
      } else{
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2 style={{ marginTop: '60px' }}>Welcome to the Financial Literacy Website</h2>

      {/* Conditionally render login state */}
      <div style={{ marginTop: '20px' }}>
        {user ? (
          <p>You are logged in as: {user.email}</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    </div>
  );
}
