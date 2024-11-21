'use client';

import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from './lib/logoutHook';
import { motion } from 'framer-motion';

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
            <section className="relative h-screen flex flex-col items-center justify-center">

                {/* Main Content Wrapper */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6 md:px-12 space-y-6 md:space-y-0">

                    {/* Left Side: Title and Description */}
                    <div className="text-center md:text-left text-white p-8 md:w-1/2">
                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-6xl font-bold mb-6 drop-shadow-lg text-white"
                        >
                            Profit Path
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-xl leading-relaxed drop-shadow-md text-white"
                        >
                            Take control of your financial life with our interactive tools and resources. Calculate interest, plan your retirement, and stay updated with the latest market trends.
                        </motion.p>
                    </div>

                    {/* Right Side: Image */}
                    <div className="flex justify-center md:w-1/2">
                        <img
                            src="https://img.freepik.com/free-vector/hand-drawn-revenue-operations-illustration_23-2150961528.jpg"
                            alt="Profit Path logo"
                            className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                    </div>
                </div>

                {/* Welcome and Logout Section */}
                <div className="text-white p-6 mt-8">
                    <div className="flex justify-between items-center w-full">
                        {/* Welcome Message on the Left */}
                        {user && (
                            <p className="text-lg">
                                Welcome, {userFullName ? userFullName : 'User'}!
                            </p>
                        )}

                        {/* Logout Button - Only visible if user is valid */}
                        {user && (
                            <button
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-green-700 transition-all"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );

}
