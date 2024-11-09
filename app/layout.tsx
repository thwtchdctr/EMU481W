import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Import fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the website
export const metadata: Metadata = {
  title: "Financial Literacy Website",
  description: "Learn to manage your finances effectively",
};

// Main RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-100 to-gray-300`} // Add gradient to body
      >
        {/* Header with gradient and minimized white edges */}
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

            {/* Sign Up / Log In Buttons */}
            <div className="flex space-x-4">
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
            </div>
          </nav>
        </header>

        {/* Main content with a more colorful background and container */}
        <main className="container mx-auto py-12 bg-gradient-to-r from-blue-50 to-teal-100 rounded-lg shadow-md p-8">
          {children}
        </main>

        {/* Add footer to balance the layout */}
        <footer className="mt-12 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-center p-6 text-white">
          <p>© 2024 Financial Literacy Website. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

