"use client";

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLogoutHook } from "./lib/logoutHook";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const logout = useLogoutHook();

  const fetchUserFullName = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserFullName(data?.name || null);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserFullName(user.uid);
      } else {
        setUser(null);
        setUserFullName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <section className="relative bg-gray-200 h-screen flex justify-center items-center">
        <img
          src="https://img.freepik.com/free-vector/gradient-screensaver-green-tones_23-2148368885.jpg"
          alt="Financial Literacy"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white">Profit Path</h1>
        </div>
      </section>

      <div className="text-right">
        <button className="button" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
