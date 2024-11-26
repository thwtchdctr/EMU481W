//client component
'use client';

//import statements
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from './lib/logoutHook';
import { motion } from 'framer-motion';

/* @Home() -> Renders the home page of the application
 */
export default function Home() {
  //State vars
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  //Implement logout hook to allow user to logout
  const logout = useLogoutHook();

  /*@fetchFullUserName() -> Function to fetch the users full name from database based on the uid as string
    @params -> uid (string): user id as string */
  const fetchUserFullName = async (uid: string) => {
    try {
      //get user doc
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      //if user exists
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

  /* @useEffect() -> React effect that lisents to state of auth changes using Firebase"s "onAuthStateChanged"
   */
  useEffect(() => {
    //Clean up listener on unmount
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
