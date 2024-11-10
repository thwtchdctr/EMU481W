'use client';

import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from './lib/logoutHook';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      {/* Hero Section */}
      <section className="relative bg-green-400 h-screen flex justify-center items-center">
        <img
          src="https://img.freepik.com/free-vector/gradient-screensaver-green-tones_23-2148368885.jpg"
          alt="Financial Literacy"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center text-white p-8 float:left">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-bold mb-6 drop-shadow-lg"
          >
            Profit Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          >
            Take control of your financial life with our interactive tools and resources. Calculate interest, plan your retirement, and stay updated with the latest market trends.
          </motion.p>
              </div>
              <div className="float:right">
                  <img src="https://img.freepik.com/free-vector/hand-drawn-revenue-operations-illustration_23-2150961528.jpg" alt="Profit Path logo" className="rounded"></img>
              </div>
      </section>

      {/* Welcome and Logout Section */}
      <div className="relative z-20 text-white p-6">
        <div className="flex justify-between items-center">
          {user && (
            <p className="text-lg">
              Welcome, {userFullName ? userFullName : 'User'}!
            </p>
          )}
          <button
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-green-700 transition-all"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
