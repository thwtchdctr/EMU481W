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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-100 to-gray-300`} // Add gradient to body
          >
        {/* Main Layout */}
        <div className="relative min-h-screen">
            {/* Header */}
            <header className="w-full bg-transparent shadow-lg backdrop-blur-sm z-100">
              <nav className="container mx-auto p-6 flex justify-between items-center">
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
                <div className="flex space-x-4">
                  <a href="/signup" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-2xl hover:from-teal-600 hover:to-green-600 transition-all duration-300">
                    Sign Up
                  </a>
                  <a href="/login" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full shadow-md hover:bg-gray-300 transition-all duration-300">
                    Log In
                  </a>
                </div>
              </nav>
            </header>

            {/* Background image */}
            <img
                src="https://img.freepik.com/free-vector/gradient-screensaver-green-tones_23-2148368885.jpg"
                alt="Financial Literacy"
                className="absolute top-0 left-0 w-screen h-full object-cover -z-10"
            />

            {/* Main content */}
            <main className="z-10 min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full bg-transparent backdrop-blur-sm flex justify-center items-center p-4">
                <p>© 2024 Financial Literacy Website. All rights reserved.</p>
            </footer>
        </div>

      </body>
    </html>
  );
}