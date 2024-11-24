'use client';

import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useLogoutHook } from './lib/logoutHook';
import { motion } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const router = useRouter();
  const logout = useLogoutHook();

  // This function will be triggered when the 'Welcome User' button is clicked
  const handleGoToProfile = () => {
    if (user) {
      router.push('/profile'); // Redirect to profile page
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserFullName(user.displayName || 'User');
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
      <section className="relative h-screen flex justify-center items-center bg-green-400">
        <img
          src="https://img.freepik.com/free-vector/gradient-screensaver-green-tones_23-2148368885.jpg"
          alt="Financial Literacy"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white p-8">
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
      </section>
    </div>
  );
}
