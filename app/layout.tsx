import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Financial Literacy Website",
  description: "Learn to manage your finances effectively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full bg-gray-100 shadow-md">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <div className="flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-blue-500">Home</a>
              <a href="/calculators" className="text-gray-700 hover:text-blue-500">Calculators</a>
              <a href="/news" className="text-gray-700 hover:text-blue-500">News Feed</a>
              <a href="/nlp" className="text-gray-700 hover:text-blue-500">NLP</a>
            </div>
            <div className="flex space-x-4">
              <a href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</a>
              <a href="/login" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Log In</a>
            </div>
          </nav>
        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
