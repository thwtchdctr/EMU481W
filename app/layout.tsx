// EMU481W-nov12/app/layout.tsx

'use client';

import localFont from 'next/font/local';
import './globals.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useLogoutHook } from './lib/logoutHook';

// Import custom fonts
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

// Main RootLayout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const logout = useLogoutHook();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserFullName(user.displayName || 'User'); // Use displayName if available
      } else {
        setUser(null);
        setUserFullName(null);
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
              <a href="/mock-register" className="text-white hover:text-yellow-200 transition-all duration-300">
                Mock Register
              </a>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {loading ? (
                // Show a loading placeholder while waiting for the auth state
                <p className="text-white">Loading...</p>
              ) : user ? (
                <>
                  <p className="text-white font-semibold">
                    Welcome, {userFullName || 'User'}!
                  </p>
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
