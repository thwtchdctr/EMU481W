//Client component
'use client';

//Import statements
import localFont from 'next/font/local';
import './globals.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from './lib/logoutHook';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Metadata for the website
// export const metadata = {
//   title: 'Financial Literacy Website',
//   description: 'Learn to manage your finances effectively',
// };

//Main RootLayout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  //State vars
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const logout = useLogoutHook();
  const [adminString, setAdminString] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserFullName(user.displayName || 'null');

        //Fetch user's admin status from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            if(userDoc.data()?.isAdmin){
              setIsAdmin(true);
              setAdminString("ADMIN");
            } else{
              setIsAdmin(false);
              setAdminString("");
            }
          } else {
            setIsAdmin(false);
            setAdminString("");
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setUserFullName(null);
        setIsAdmin(false); // Reset admin state if no user is logged in
      }
      setLoading(false); // Set loading to false once the user state is resolved
    });

    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-100 to-gray-300`}
      >
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 shadow-lg backdrop-blur-sm">
          <nav className="container mx-auto p-6 flex justify-between items-center">
            {/* Navigation Links */}
            <div className="flex space-x-8">
              <a href="/" className="text-white hover:text-yellow-200 transition-all duration-300">
                Home
              </a>
              <a href="/calculators" className="text-white hover:text-yellow-200 transition-all duration-300">
                Calculators
              </a>
              <a href="/news" className="text-white hover:text-yellow-200 transition-all duration-300">
                News Feed
              </a>
              <a href="/qa" className="text-white hover:text-yellow-200 transition-all duration-300">
                QA
              </a>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {loading ? (
                // Show a loading placeholder while waiting for the auth state
                <p className="text-white">Loading...</p>
              ) : user?(
                <>
                  <a href="/profile" className="text-white font-semibold">
                    {adminString} Welcome, {user.displayName || 'null'}!
                  </a>
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-md hover:from-pink-600 hover:to-red-600 transition-all duration-300"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-2xl hover:from-teal-600 hover:to-green-600 transition-all duration-300"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full shadow-md hover:bg-gray-300 transition-all duration-300"
                  >
                    Log In
                  </a>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="container mx-auto py-12 bg-gradient-to-r from-blue-50 to-teal-100 rounded-lg shadow-md p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-12 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-center p-6 text-white">
          <p>© 2024 Financial Literacy Website. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
